import { WebPartContext } from "@microsoft/sp-webpart-base";
import { EnvironmentType } from "@microsoft/sp-core-library";
import { SPHttpClient } from "@microsoft/sp-http";
import { IListCollection } from "./IList";
import { IListFieldCollection } from "./IListField";
import { IListItemCollection } from "./IListItem";

export class SharePointServiceManager {
    public context: WebPartContext;
    public environmentType: EnvironmentType;
    public ideaListID: string;

    public setup(context: WebPartContext, environmentType: EnvironmentType, ideaListID: string): void {
        this.context = context;
        this.environmentType = environmentType;
        this.ideaListID = ideaListID;
    }

    public get(relativeEndpointUrl: string): Promise<any> {
        return this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}${relativeEndpointUrl}`, SPHttpClient.configurations.v1)
        .then(
            response => {
                return response.json()
            }
        )
        .catch(error => {
            return Promise.reject(error);
        });
    }

    public getLists(): Promise<IListCollection> {
        return this.get('/_api/lists');
    }

    public getListItems(listId: string, selectedFields?: string[]) : Promise<IListItemCollection>{
        return this.get(`/_api/lists/getbytitle('${listId}')/items?$select=*,Author/Name,Author/Title,LinkToSpec/Title&$expand=Author/Id,LinkToSpec/Id,AttachmentFiles`);
    }

    public getListItemsFIltered(listId: string, filterString: string) : Promise<IListItemCollection>{
        //console.log(`/_api/lists/getbyid('${listId}')/items?$filter=IdeaStatus eq '${filterString}'`);
        return this.get(`/_api/lists/getbytitle('${listId}')/items?$select=*,Author/Name,Author/Title,LinkToSpec/Title&$expand=Author/Id,LinkToSpec/Id,AttachmentFiles&$filter=IdeaStatus eq '${filterString}'`);
    }

    public getListFields(listId: string, showHiddenField: boolean = false): Promise<IListFieldCollection>{
        return this.get(`/_api/lists/getbytitle('${listId}')/fields${!showHiddenField ? '?$filter=Hidden eq false' : ''}`);
    }

    
    public getUserByID(userID: string): Promise<any> {
        return this.get(`/_api/web/getuserbytitle(${userID})`);
    }

    
    
    
    public getUsers(): Promise<any> {
        return this.get(`/_api/web/siteusers`);
    }
     
    

}

const SharePointService = new SharePointServiceManager();

export default SharePointService;  //singleton pattern