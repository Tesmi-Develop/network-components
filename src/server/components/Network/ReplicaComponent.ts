import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

@Component({})
export class ReplicaComponent<A, M extends Instance, C extends keyof ReplicaComponents> extends BaseComponent<A, M> implements OnStart {
    protected remoteEvent = new Instance('RemoteEvent');

    protected onRequestData(player: Player): ReplicaComponents[C] {
        error('Not overrided onRequestData');
    }

    protected initReplica() {
        this.remoteEvent.Parent = this.instance;

        this.remoteEvent.OnServerEvent.Connect((player) => {
            this.remoteEvent.FireClient(player, 'RequestData', this.onRequestData(player));
        });
    }

    public onStart() {
        this.initReplica();
    }
}


