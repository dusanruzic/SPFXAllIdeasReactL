import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'HelloWorldWebPartStrings';
import Webpartic from './components/Webpartic';
import { IHelloWorldProps } from './components/IHelloWorldProps';
import SharePointService from '../../services/SharePoint/SharePointService';
import {Environment } from '@microsoft/sp-core-library';

export interface IHelloWorldWebPartProps {
  description: string;
}

export default class HelloWorldWebPart extends BaseClientSideWebPart<IHelloWorldWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IHelloWorldProps > = React.createElement(
      Webpartic,
      {
        description: this.properties.description
      }
    );

    ReactDom.render(element, this.domElement);
  }

  public onInit(): Promise<void> {
    return super.onInit().then(() =>{

      //let ideaListId = 'CF70FB14-EE3E-4D16-921A-3449856770E7'; //sa nase sajt kolekcije
      //let ideaListId = 'Bcbcf314d-6d42-48ab-aff9-87c01bba1046'; // ne moze jer ne prima dobar id, mora da se prekonfigurise, idemo preko list name
      let ideaListId = 'Idea';

      SharePointService.setup(this.context, Environment.type, ideaListId);
      SharePointService.getLists().then(lists => {
        //console.log('prikaz svih lista');
        //console.log(lists);

      });

      SharePointService.getListItems(SharePointService.ideaListID)
      .then(items => {
        //console.log(items);
      });


      //console.log('USPELO JE! BRAVO!');
      //this.context.propertyPane.open();
      //this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/lists/getbytitle('Stock')/items?$select=Title,Price,Supplier&$filter=Price gt 100`, SPHttpClient.configurations.v1)
      //.then(response => {
        //response.json().then((json: any) => {
          //console.log(json);
        //})
      //});
    //});
  })}

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
