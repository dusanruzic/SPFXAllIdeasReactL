import * as React from 'react';
import styles from './Webpartic.module.scss';
import { IWebparticProps } from './IWebparticProps';
import SharePointService from '../../../services/SharePoint/SharePointService';
import { IWebparticState } from './IWebparticState';

import {
  DocumentCard,
  DocumentCardActivity,
  DocumentCardPreview,
  DocumentCardTitle,
  DocumentCardLocation,
  IDocumentCardPreviewProps,
} from 'office-ui-fabric-react/lib/DocumentCard';

import { Button, ButtonType, } from 'office-ui-fabric-react';

import { SearchBox, ISearchBoxStyles } from 'office-ui-fabric-react/lib/SearchBox';



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

/*let previewProps: IDocumentCardPreviewProps = {
      previewImages: [
        {
          previewImageSrc: String(require('./avatar-kat.png')),
          width: 318,
          height: 196,
          accentColor: '#ce4b1f'
        }
      ],
    };
*/
    SharePointService.getListFields('CF70FB14-EE3E-4D16-921A-3449856770E7')
      .then(items => {
        console.log('fields:');
        console.log(items);
        
      });

      const searchBoxStyles: Partial<ISearchBoxStyles> = { root: {  marginBottom: '30px' } };

// tslint:disable:jsx-no-lambda
     
     
    return (
      
      <div className={ styles.webpartic }>

<div className="ms-Grid" dir="ltr">
        <div className="ms-Grid-row">
        <div className="ms-Grid-col ms-sm2 ms-md4 ms-lg6 ms-xl6"> </div>
          <div className="ms-Grid-col ms-sm10 ms-md8 ms-lg6 ms-xl6">

          
          <SearchBox
            styles={searchBoxStyles}
            placeholder="Search"
            onEscape={ev => {
              console.log('Custom onEscape Called');
            }}
            onClear={ev => {
              console.log('Custom onClear Called');
            }}
            onChange={(name) => this.getItemsByName(name)}
            onSearch={newValue => console.log('SearchBox onSearch fired: ' + newValue)}
          />

</div>

          </div>
          </div>

      <div style={{textAlign: "center"}}>

      
      <Button  buttonType={ ButtonType.primary }  title='All' ariaLabel='All'  onClick={this.getItems} >
        <span>All</span>
      </Button>

      <Button className={styles.myButtons} buttonType={ ButtonType.normal } title='Open' ariaLabel='Open' style={{marginLeft:"15px"}}  onClick={this.getOpen}>
        <span>Open</span>
      </Button>

      <Button className={styles.myButtons} buttonType={ ButtonType.normal } title='On hold' ariaLabel='On hold' style={{marginLeft:"15px"}} onClick={this.getOngoing}>
        <span>On hold</span>
      </Button>

      <Button className={styles.myButtons} buttonType={ ButtonType.normal }  title='Close' ariaLabel='Close' style={{marginLeft:"15px"}} onClick={this.getClosed}>
        <span>Close</span>
      </Button>


      </div>
      
      <hr></hr>

        <div className="ms-Grid" dir="ltr">
        <div className="ms-Grid-row">
        
        {this.state.items.map(item => {
          console.log(item);
          let previewPropsa: IDocumentCardPreviewProps = {
            previewImages: [
              {
                previewImageSrc: 'https://lh3.googleusercontent.com/proxy/c4UYjqsd2AzGDZU6GdY65h-oDwfBQZ18QYStqmEfnDcckG_g1wcqxG1x38MAPEgwgHttj0CJ8hGcod94NvwIpVI7Bb4jEnIbwWb_8ZQ-710l8bFq',
                width: 318,
                height: 156,
                accentColor: '#ce4b1f'
              }
            ],
          };
          if (item.AttachmentFiles.length > 0) {
            previewPropsa.previewImages[0].previewImageSrc = `https://jvspdev.sharepoint.com${item.AttachmentFiles[0].ServerRelativeUrl}`
             console.log(item.AttachmentFiles[0].ServerRelativeUrl);
          }

          let createdOn = new Date(item.Created);
          let formatedDate = `${createdOn.toLocaleString("default", { month: "long" })} ${createdOn.getDay()}, ${createdOn.getFullYear()} at ${createdOn.getHours()}:${createdOn.getMinutes()}:${createdOn.getSeconds()}`;
          let hrf = `https://jvspdev.sharepoint.com/sites/AtlasCorpoProject/SitePages/idea${item.Id}.aspx`;

           return (

                
              <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg6 ms-xl4"  style={{marginBottom:'5px'}}>
                    
                    <DocumentCard onClickHref= {hrf}>
                      <DocumentCardPreview { ...previewPropsa } 
                      />
                      <DocumentCardLocation
                        location= {item.IdeaStatus}
                        ariaLabel= {item.IdeaStatus}
                      />
                      <DocumentCardTitle title= {item.Title} />
                      <DocumentCardActivity
                        activity= {formatedDate}
                        people={
                          [
                            { name: `${item.Author.Title}`, profileImageSrc: 'https://lh3.googleusercontent.com/proxy/c4UYjqsd2AzGDZU6GdY65h-oDwfBQZ18QYStqmEfnDcckG_g1wcqxG1x38MAPEgwgHttj0CJ8hGcod94NvwIpVI7Bb4jEnIbwWb_8ZQ-710l8bFq' }
                          ]
                        }
                      />
                    </DocumentCard>

                  </div>
 
          );
        })}
           </div>
        </div>

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
    //window.location.href = `https://jvspdev.sharepoint.com/sites/AtlasCorpoProject/Lists/Idea/DispForm.aspx?ID=${itemID}`;
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

  public prikazialert(): void {
    alert('uspeo!');
  }

  public getItemsByName(name: string): void {
    console.log(name);
    SharePointService.getListItems('CF70FB14-EE3E-4D16-921A-3449856770E7')
      .then(
        
        items => {
          let ideas = items.value.filter((idea) => idea.Title.toUpperCase().indexOf(name.toUpperCase()) !== -1 );
          console.log(ideas);
        console.log('vratio');
        this.setState({
          items: ideas,
        });
      });
  }

  

  
}
