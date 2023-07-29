import { Component } from "@flamework/components";
import { ReplicaComponent } from "./ReplicaComponent";
import { Path, PathValue } from "Types/utility";
import { ArrayInsert, ArrayRemove, ArraySet, SetValue, stringPathToArray } from "shared/ReplicaComponentUtilities";

const emptyObject = {}

@Component({})
export class ReplicaAllComponent<A, M extends Instance, C extends keyof ReplicaComponents> extends ReplicaComponent<A, M, C> {
    protected replica: ReplicaComponents[C] = emptyObject as ReplicaComponents[C];

    protected onRequestData(): ReplicaComponents[C] {
        return this.replica;
    }

    protected OnStart() {
        error('Not overrided OnStart');
    }

    SetData(replica: ReplicaComponents[C]) {
        this.replica = replica;
    }

    onStart() {
        super.onStart();
        this.OnStart();

        if (this.replica === emptyObject) {
            error('Not overrided replica');
        }
    }

    SetValue<P extends Path<ReplicaComponents[C], 'Main'>>(path: P, value: PathValue<ReplicaComponents[C], P>) {
        const pathArray = typeOf(path) === 'string' ? stringPathToArray(path as string) : path as string[];
        
        SetValue(this.replica, pathArray, value);
         
        this.remoteEvent.FireAllClients('SetValue', pathArray, value);
    }

    ArrayInsert<P extends Path<ReplicaComponents[C], 'Arrays'>>(path: P, value: PathValue<ReplicaComponents[C], P> extends Array<infer T> ? T : never) {
        const pathArray = typeOf(path) === 'string' ? stringPathToArray(path as string) : path as string[];

        ArrayInsert(this.replica, pathArray, value as defined);

        this.remoteEvent.FireAllClients('ArrayInsert', pathArray, value);
    }

    ArraySet<P extends Path<ReplicaComponents[C], 'Arrays'>>(path: P, index: number, value: PathValue<ReplicaComponents[C], P> extends Array<infer T> ? T : never) {
        const pathArray = typeOf(path) === 'string' ? stringPathToArray(path as string) : path as string[];

        ArraySet(this.replica, pathArray, index, value as defined);

        this.remoteEvent.FireAllClients('ArraySet', pathArray, index, value);
    }

    ArrayRemove<P extends Path<ReplicaComponents[C], 'Arrays'>>(path: P, index: number): PathValue<ReplicaComponents[C], P> extends Array<infer T> ? T : never {
        const pathArray = typeOf(path) === 'string' ? stringPathToArray(path as string) : path as string[];

        const value = ArrayRemove(this.replica, pathArray, index);

        this.remoteEvent.FireAllClients('ArrayRemove', pathArray, index);

        return value as (PathValue<ReplicaComponents[C], P> extends Array<infer T> ? T : never);
    }
}