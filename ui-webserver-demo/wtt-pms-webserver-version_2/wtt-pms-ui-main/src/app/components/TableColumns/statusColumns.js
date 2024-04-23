import { labelArchive, labelDraft, labelPublished } from "app/utils/constantForms";
import { HeaderContextMenu } from "../HeaderMenu/HeaderMenu";

export const statusColumns = [
  {
    field: 'Published',
    title: labelPublished,
    sorter: 'string',
    headerTooltip: true,
    hozAlign: 'left',
    className: '',
    headerMenu: HeaderContextMenu,
  },
  {
    field: 'Draft',
    title: labelDraft,
    sorter: 'string',
    headerTooltip: true,
    hozAlign: 'left',
    className: '',
    headerMenu: HeaderContextMenu,
  },
  {
    field: 'Archive',
    title: labelArchive,
    sorter: 'string',
    headerTooltip: true,
    hozAlign: 'left',
    className: 'fa-regular fa-square',
    headerMenu: HeaderContextMenu,
  },
]