import React from 'react';
import Icon from '@ant-design/icons';
import { ReactComponent as EditImg } from 'assets/img/other-icons/edit-icon.svg';
import { ReactComponent as ArchiveImg } from 'assets/img/other-icons/archive-icon.svg';
import { ReactComponent as ViewImg } from 'assets/img/other-icons/view-icon.svg';
import { ReactComponent as ResetImg } from 'assets/img/other-icons/reset-icon.svg';
import { ReactComponent as JobImg } from 'assets/img/other-icons/job-icon.svg';
import { ReactComponent as ErrorJobImg } from 'assets/img/other-icons/error-job-icon.svg';
import { ReactComponent as InvoiceImg } from 'assets/img/other-icons/open-invoice.svg';
import { ReactComponent as ClosedInvImg } from 'assets/img/other-icons/closed-invoice.svg';
import { ReactComponent as TotalAmtImg } from 'assets/img/other-icons/total-amount.svg';
import { ReactComponent as UserImg } from 'assets/img/other-icons/user.svg';
import { ReactComponent as CreditPriceImg } from 'assets/img/other-icons/creidt-price.svg';
import { ReactComponent as WaitingPriceImg } from 'assets/img/other-icons/waiting-approval.svg';
import { ReactComponent as UploadImg } from 'assets/img/other-icons/upload-icon.svg';
import { ReactComponent as DownloadImg } from 'assets/img/other-icons/downicon.svg';
import { ReactComponent as EyeImg } from 'assets/img/other-icons/eye-icon.svg';
import { ReactComponent as PayImg } from 'assets/img/other-icons/pay-icon.svg';
import { ReactComponent as ViewDocImg } from 'assets/img/other-icons/preview-doc-upload.svg';

const EditIcon = () => <Icon component={EditImg} />;
const ArchiveIcon = () => <Icon component={ArchiveImg} />;
const ViewIcon = () => <Icon component={ViewImg} />;
const ResetIcon = () => <Icon component={ResetImg} />;
const JobIcon = () => <Icon component={JobImg} />;
const ErrorJobIcon = () => <Icon component={ErrorJobImg} />;
const OpenInvoiceIcon = () => <Icon component={InvoiceImg} />;
const ClosedInvoiceIcon = () => <Icon component={ClosedInvImg} />;
const TotalAmountIcon = () => <Icon component={TotalAmtImg} />;
const CreditPriceIcon = () => <Icon component={CreditPriceImg} />;
const UserIcon = () => <Icon component={UserImg} />;
const WaitingIcon = () => <Icon component={WaitingPriceImg} />;
const UploadIcon = () => <Icon component={UploadImg} />;
const DownloadIcon = () => <Icon component={DownloadImg} />;
const EyeIcon = () => <Icon component={EyeImg} />;
const PayIcon = () => <Icon component={PayImg} />;
const DocViewIcon = () => <Icon component={ViewDocImg} />;

export {
    EditIcon, ArchiveIcon, ViewIcon, ResetIcon, JobIcon, ErrorJobIcon, UploadIcon,DownloadIcon,
    OpenInvoiceIcon, ClosedInvoiceIcon, TotalAmountIcon, UserIcon, CreditPriceIcon, WaitingIcon,
    EyeIcon,PayIcon,DocViewIcon
};