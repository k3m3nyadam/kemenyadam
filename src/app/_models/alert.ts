export class Alert{
    id: string;
    message: string;
    type: AlertType;
    autoClose: boolean;
    keepAfterRootChange: boolean;
    fade: boolean;

    constructor (init: Partial<Alert>){
        Object.assign(this, init);
    }
}

export enum AlertType{
    Succes,
    Error,
    Info,
    Warning
}

export class AlertOptions{
    id?: string;
    autoClose?: boolean;
    keepAfterRootChange?: boolean;
}