import { Component } from "@flamework/components";
import { ReplicaComponent } from "./ReplicaComponent";
import { Path, PathValue } from "Types/utility";
import { ArrayInsert, ArrayRemove, ArraySet, SetValue, stringPathToArray } from "shared/ReplicaComponentUtilities";

const emptyObject = {}

@Component({})
export class ReplicaIndividualComponent<A, M extends Instance, C extends keyof ReplicaComponents> extends ReplicaComponent<A, M, C> {
    protected replicas = new Map<Player, ReplicaComponents[C]>();

    protected getReplica(player: Player) {
        return this.replicas.get(player);
    }

    protected OnRequestData(player: Player): ReplicaComponents[C] {
        error('Not overrided OnRequestData');
    }

    protected onRequestData(player: Player): ReplicaComponents[C] {
        let replica = this.replicas.get(player);

        if (replica !== undefined) {
            return replica;
        }

        replica = this.OnRequestData(player);
        this.replicas.set(player, replica);

        return replica; 
    } 

    protected OnStart() {
        error('Not overrided OnStart');
    }

    onStart() {
        super.onStart();
        this.OnStart();
    }

    SetValue<P extends Path<ReplicaComponents[C], 'Main'>>(player: Player | 'All', path: P, value: PathValue<ReplicaComponents[C], P>) {
        const pathArray = typeOf(path) === 'string' ? stringPathToArray(path as string) : path as string[];

        if (player === 'All') {
            this.replicas.forEach((data, anotherPlayer) => {
                SetValue(data, pathArray, value);
                this.remoteEvent.FireClient(anotherPlayer, 'SetValue', pathArray, value);
            });
            return;
        }

        const data = this.replicas.get(player);
        if (data === undefined) return;
        
        SetValue(data, pathArray, value);
         
        this.remoteEvent.FireClient(player, 'SetValue', pathArray, value);
    }

    ArrayInsert<P extends Path<ReplicaComponents[C], 'Arrays'>>(player: Player | 'All', path: P, value: PathValue<ReplicaComponents[C], P> extends Array<infer T> ? T : never) {
        const pathArray = typeOf(path) === 'string' ? stringPathToArray(path as string) : path as string[];

        if (player === 'All') {
            this.replicas.forEach((data, anotherPlayer) => {
                ArrayInsert(data, pathArray, value as defined);
                this.remoteEvent.FireClient(anotherPlayer, 'ArrayInsert', pathArray, value);
            });
            return;
        }

        const data = this.replicas.get(player);
        if (data === undefined) return;

        ArrayInsert(data, pathArray, value as defined);

        this.remoteEvent.FireClient(player, 'ArrayInsert', pathArray, value);
    }

    ArraySet<P extends Path<ReplicaComponents[C], 'Arrays'>>(player: Player | 'All', path: P, index: number, value: PathValue<ReplicaComponents[C], P> extends Array<infer T> ? T : never) {
        const pathArray = typeOf(path) === 'string' ? stringPathToArray(path as string) : path as string[];

        if (player === 'All') {
            this.replicas.forEach((data, anotherPlayer) => {
                ArraySet(data, pathArray, index, value as defined);
                this.remoteEvent.FireClient(anotherPlayer, 'ArraySet', pathArray, index, value);
            });
            return;
        }

        const data = this.replicas.get(player);
        if (data === undefined) return;

        ArraySet(data, pathArray, index, value as defined);

        this.remoteEvent.FireClient(player, 'ArraySet', pathArray, index, value);
    }

    ArrayRemove<P extends Path<ReplicaComponents[C], 'Arrays'>>(player: Player | 'All', path: P, index: number): (PathValue<ReplicaComponents[C], P> extends Array<infer T> ? T : never) | undefined {
        const pathArray = typeOf(path) === 'string' ? stringPathToArray(path as string) : path as string[];

        if (player === 'All') {
            this.replicas.forEach((data, anotherPlayer) => {
                ArrayRemove(data, pathArray, index);
                this.remoteEvent.FireClient(anotherPlayer, 'ArrayRemove', pathArray, index);
            });
            return;
        }

        const data = this.replicas.get(player);
        if (data === undefined) return ;

        const value = ArrayRemove(data, pathArray, index);

        this.remoteEvent.FireClient(player, 'ArrayRemove', pathArray, index);

        return value as (PathValue<ReplicaComponents[C], P> extends Array<infer T> ? T : never);
    }
}