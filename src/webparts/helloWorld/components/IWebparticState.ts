import { IListItem } from './../../../services/SharePoint/IListItem';

export interface IWebparticState {
    items: IListItem[];
    users: any[];
    loading: boolean;
    visible: boolean;
}