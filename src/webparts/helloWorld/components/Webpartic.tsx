import * as React from 'react';
import styles from './Webpartic.module.scss';
import { IWebparticProps } from './IWebparticProps';
import SharePointService from '../../../services/SharePoint/SharePointService';
import { IWebparticState } from './IWebparticState';

import { Toggle } from 'office-ui-fabric-react/lib/Toggle';

import {
  DocumentCard,
  DocumentCardActivity,
  DocumentCardPreview,
  DocumentCardTitle,
  IDocumentCardPreviewProps,
} from 'office-ui-fabric-react/lib/DocumentCard';




export default class Webpartic extends React.Component<IWebparticProps, IWebparticState> {

  constructor(props: IWebparticProps){
    super(props);

    //bind
    this.getItems = this.getItems.bind(this);
    this.getOngoing = this.getOngoing.bind(this);
    this.getOpen = this.getOpen.bind(this);
    this.getClosed = this.getClosed.bind(this);
    this.changeVisibleOfFilter = this.changeVisibleOfFilter.bind(this);
    this.goToItem = this.goToItem.bind(this);
    this.returnUserByID = this.returnUserByID.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.promenilo = this.promenilo.bind(this);

    //set initial state:
    this.state = {
      items: [],
      users: [],
      loading: false,
      visible: false,
    };

    this.getItems();
    this.getUsers();
  }


  
  public render(): React.ReactElement<IWebparticProps> {  

    const previewProps: IDocumentCardPreviewProps = {
      previewImages: [
        {
          previewImageSrc: String(require('./avatar-kat.png')),
          iconSrc: String(require('./avatar-kat.png')),
          width: 318,
          height: 196,
          accentColor: '#ce4b1f'
        }
      ],
    };

    SharePointService.getListFields('CF70FB14-EE3E-4D16-921A-3449856770E7')
      .then(items => {
        console.log('fields:');
        console.log(items);
        
      });

      
     
     
    return (
      
      <div className={ styles.webpartic }>



<Toggle label="Enabled and checked" defaultChecked onText="On" offText="Off"  onChange={this.promenilo}/>

        <div>

              
          <img src="https://www.goaugment.io/wp-content/uploads/2016/05/New-Software-Idea-1200x704.jpg" alt="Nema slike" className={styles.naslovnaSlika}/>
        
        <h1 style= {{textAlign: 'center'}} className={styles.naslov}>IDEAS</h1>
        </div>
        <hr></hr>
    <button onClick={this.changeVisibleOfFilter} style={{marginLeft: '20px'}}><i className="ms-Icon ms-Icon--FilterSolid" aria-hidden="true"> by Status </i></button>
        <span style={this.state.visible? {display: 'inline'} : {display: 'none'} }> <button onClick={this.getOpen} className={styles.statusBtn} style={{backgroundColor: 'green', marginLeft: '20px'}}>OPEN</button> <button className={styles.statusBtn} onClick={this.getOngoing} style={{backgroundColor: 'yellow'}}>ON HOLD</button> <button className={styles.statusBtn} onClick={this.getClosed} style={{backgroundColor: 'red'}}>CLOSED</button></span>
        <hr></hr>
        
        {this.state.items.map(item => {
          console.log(item);

           return (

              <div>
                
                    <DocumentCard onClickHref='http://bing.com'>
                      <DocumentCardPreview { ...previewProps } />
                      <DocumentCardTitle title= {item.Title} />
                      <DocumentCardActivity
                        activity= {item.Created}
                        people={
                          [
                            { name: `${item.Author.Title}`, profileImageSrc: String(require('./avatar-kat.png')) }
                          ]
                        }
                      />
                    </DocumentCard>

                    <hr></hr>
                  </div>
 
          );
        })}

      </div>
    );
  }


  public getItems(): void {
    this.setState({loading: true});
    SharePointService.getListItems('CF70FB14-EE3E-4D16-921A-3449856770E7')
      .then(items => {
        console.log('vratio');
        this.setState({
          items: items.value,
          loading: false
        });
      });
  }

  public getOpen(): void {
    this.setState({loading: true});
    SharePointService.getListItemsFIltered('CF70FB14-EE3E-4D16-921A-3449856770E7', 'OPEN')
      .then(items => {
        console.log(items.value);
        console.log('vratio');
        this.setState({
          items: items.value,
          loading: false
        });
      });
  }

  public getOngoing(): void {
    this.setState({loading: true});
    SharePointService.getListItemsFIltered('CF70FB14-EE3E-4D16-921A-3449856770E7', 'ON HOLD')
      .then(items => {
        console.log(items.value);
        console.log('vratio');
        this.setState({
          items: items.value,
          loading: false
        });
      });
  }

  public getClosed(): void {
    this.setState({loading: true});
    SharePointService.getListItemsFIltered('CF70FB14-EE3E-4D16-921A-3449856770E7', 'SWITCH TO SPEC (CLOSED)')
      .then(items => {
        this.setState({
          items: items.value,
          loading: false
        });
      });
  }

  public changeVisibleOfFilter(): void {
    this.setState(
      {
        visible: !this.state.visible
      }
    );
  }

  public goToItem(itemID: number): void {
    console.log(itemID);
    window.location.href = `https://jvspdev.sharepoint.com/sites/AtlasCorpoProject/Lists/Idea/DispForm.aspx?ID=${itemID}`;
  }

  public returnUserByID(itemID: string): string {
    console.log(itemID);
    console.log('proba');
    SharePointService.getUserByID(itemID)
    .then(item => {
      return item;
    });
    return '';
      
  }

  public getUsers(): void {
    SharePointService.getUsers()
      .then(users => {
        console.log(users.value[1]);
        this.setState({
          users: users.value,
        });
      });
  }


  public promenilo(): void {
    alert('promenilo se!');
    console.log('bravo');
  }
  
  

  
}
