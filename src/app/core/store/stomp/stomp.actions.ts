import { Action } from '@ngrx/store';

export enum StompActionTypes {
    CONNECT = '[Stomp] connect',
    CONNECT_SUCCESS = '[Stomp] connected successfully',
    CONNECT_FAILURE = '[Stomp] failed to connect',
    DISCONNECT = '[Stomp] disconnect',
    DISCONNECT_SUCCESS = '[Stomp] disconnected successfully',
    DISCONNECT_FAILURE = '[Stomp] failed to disconnect',
    SUBSCRIBE = '[Stomp] subscribe',
    SUBSCRIBE_SUCCESS = '[Stomp] subscribed successfully',
    SUBSCRIBE_FAILURE = '[Stomp] failed to subscribe',
    UNSUBSCRIBE = '[Stomp] unsubscribe',
    UNSUBSCRIBE_SUCCESS = '[Stomp] unsubscribed successfully',
    UNSUBSCRIBE_FAILURE = '[Stomp] failed to unsubscribe'
}

export class ConnectAction implements Action {
    readonly type = StompActionTypes.CONNECT;
    constructor(public payload?: any) { }
}

export class ConnectSuccessAction implements Action {
    readonly type = StompActionTypes.CONNECT_SUCCESS;
    constructor(public payload?: any) { }
}

export class ConnectFailureAction implements Action {
    readonly type = StompActionTypes.CONNECT_FAILURE;
    constructor(public payload: { response: any }) { }
}

export class DisconnectAction implements Action {
    readonly type = StompActionTypes.DISCONNECT;
    constructor(public payload?: any) { }
}

export class DisconnectSuccessAction implements Action {
    readonly type = StompActionTypes.DISCONNECT_SUCCESS;
    constructor(public payload?: any) { }
}

export class DisconnectFailureAction implements Action {
    readonly type = StompActionTypes.DISCONNECT_FAILURE;
    constructor(public payload: any) { }
}

export class SubscribeAction implements Action {
    readonly type = StompActionTypes.SUBSCRIBE;
    constructor(public payload: string) { }
}

export class SubscribeSuccessAction implements Action {
    readonly type = StompActionTypes.SUBSCRIBE_SUCCESS;
    constructor(public payload: any) { }
}

export class SubscribeFailureAction implements Action {
    readonly type = StompActionTypes.SUBSCRIBE_FAILURE;
    constructor(public payload: { response: any }) { }
}

export class UnsubscribeAction implements Action {
    readonly type = StompActionTypes.UNSUBSCRIBE;
    constructor(public payload: string) { }
}

export class UnsubscribeSuccessAction implements Action {
    readonly type = StompActionTypes.UNSUBSCRIBE_SUCCESS;
    constructor(public payload?: any) { }
}

export class UnsubscribeFailureAction implements Action {
    readonly type = StompActionTypes.UNSUBSCRIBE_FAILURE;
    constructor(public payload: any) { }
}

export type StompActions =
    ConnectAction |
    ConnectSuccessAction |
    ConnectFailureAction |
    DisconnectAction |
    DisconnectSuccessAction |
    DisconnectFailureAction |
    SubscribeAction |
    SubscribeSuccessAction |
    SubscribeFailureAction |
    UnsubscribeAction |
    UnsubscribeSuccessAction |
    UnsubscribeFailureAction;
