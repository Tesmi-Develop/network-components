import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { ArrayInsert, ArrayPathToString, ArrayRemove, ArraySet, SetValue } from "shared/ReplicaComponentUtilities";
import { Path, PathValue } from "Types/utility";

type ListenerToChangeCallback<P, T> = (newValue: P, oldValue: T) => void;
type ListenerToArrayInsert<T> = (newIndex: number, newValue: T) => void;
type ListenerToArraySet<T> = (index: number, newValue: T) => void;
type ListenerToArrayRemove<T> = (oldIndex: number, oldValue: T) => void;

@Component({})
export class ReplicaComponent<A, M extends Instance, C extends keyof ReplicaComponents, D extends ReplicaComponents[C] = ReplicaComponents[C]> extends BaseComponent<A, M> implements OnStart {
    private remoteEvent = this.instance.WaitForChild('RemoteEvent') as RemoteEvent;
    protected data: D = {} as D;
    private isInited = false;
    private ListenersToChange = new Map<Path<D, "Main">, ListenerToChangeCallback<PathValue<D, Path<D, "Main">>, PathValue<D, Path<D, "Main">>>[]>(); 
    private ListenersToArrayInsert = new Map<Path<D, "Arrays">, ListenerToArrayInsert<PathValue<D, Path<D, "Arrays">>>[]>();
    private ListenersToArraySet = new Map<Path<D, "Arrays">, ListenerToArraySet<PathValue<D, Path<D, "Arrays">>>[]>();
    private ListenersToArrayRemove = new Map<Path<D, "Arrays">, ListenerToArrayRemove<PathValue<D, Path<D, "Arrays">>>[]>();

    protected OnStart() {}

    private AddElementInArray(map: Map<unknown, defined[]>, index: unknown, value: defined) {
        let array = map.get(index);

        if (array === undefined) {
            array = [];
            map.set(index, array)
        }

        array.push(value);
    }

    protected ListenToChange<P extends Path<D, "Main">>(path: P, listener: ListenerToChangeCallback<PathValue<D, P>, PathValue<D, P>>) {
        this.AddElementInArray(this.ListenersToChange, path, listener);
    }

    protected ListenToArrayInsert<P extends Path<D, "Arrays">>(path: P, listener: ListenerToArrayInsert<PathValue<D, P>>) {
        this.AddElementInArray(this.ListenersToArrayInsert, path, listener);
    }

    protected ListenToArraySet<P extends Path<D, "Arrays">>(path: P, listener: ListenerToArraySet<PathValue<D, P>>) {
        this.AddElementInArray(this.ListenersToArraySet, path, listener);
    }

    protected ListenToArrayRemove<P extends Path<D, "Arrays">>(path: P, listener: ListenerToArrayRemove<PathValue<D, P>>) {
        this.AddElementInArray(this.ListenersToArrayRemove, path, listener);
    }

    private OnSetValue(pathArray: string[], value: unknown) {
        const oldValue = SetValue(this.data, pathArray, value);

        const callbacks = this.ListenersToChange.get(ArrayPathToString(pathArray) as never);

        if (callbacks) {
            callbacks.forEach((callback) => {
                callback(value as never, oldValue);
            })
        }
    }

    private OnArrayInsert(pathArray: string[], value: defined) {
        const index = ArrayInsert(this.data, pathArray, value);

        const callbacks = this.ListenersToArrayInsert.get(ArrayPathToString(pathArray) as never);

        if (callbacks) {
            callbacks.forEach((callback) => {
                callback(index, value as never);
            })
        }
    }

    private OnArraySet(pathArray: string[], index: number, value: defined) {
        ArraySet(this.data, pathArray, index, value);

        const callbacks = this.ListenersToArraySet.get(ArrayPathToString(pathArray) as never); //

        if (callbacks) {
            callbacks.forEach((callback) => {
                callback(index, value as never);
            })
        }
    }

    private OnArrayRemove(pathArray: string[], index: number) {
        const oldValue = ArrayRemove(this.data, pathArray, index);

        const callbacks = this.ListenersToArrayRemove.get(ArrayPathToString(pathArray) as never); //

        if (callbacks) {
            callbacks.forEach((callback) => {
                callback(index, oldValue as never);
            })
        }
    }

    private initRequests() {
        this.remoteEvent.OnClientEvent.Connect((request: string, data: D) => {
            if (request === 'RequestData') {
                this.data = data;
                this.isInited = true;
            }
        });

        this.remoteEvent.OnClientEvent.Connect((request: string, path: string[], value: unknown) => {
            if (request === 'SetValue' && this.isInited) {
                this.OnSetValue(path, value);
            }
        });

        this.remoteEvent.OnClientEvent.Connect((request: string, path: string[], value: defined) => {
            if (request === 'ArrayInsert' && this.isInited) {
                this.OnArrayInsert(path, value);
            }
        });

        this.remoteEvent.OnClientEvent.Connect((request: string, path: string[], index: number, value: defined) => {
            if (request === 'ArraySet' && this.isInited) {
                this.OnArraySet(path, index, value);
            }
        });

        this.remoteEvent.OnClientEvent.Connect((request: string, path: string[], index: number) => {
            if (request === 'ArrayRemove' && this.isInited) {
                this.OnArrayRemove(path, index);
            }
        });

        this.remoteEvent.FireServer();
    }
    
    onStart() {
        this.initRequests();
        this.OnStart();
    }
}

