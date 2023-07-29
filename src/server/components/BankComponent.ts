import { Component } from "@flamework/components";
import { ReplicaIndividualComponent } from "./Network/ReplicaIndividualComponent";

@Component({
    tag: 'Bank'
})
export class BankComponent extends ReplicaIndividualComponent<{}, Instance, 'TestData'> {

    protected OnRequestData(player: Player) {
        task.spawn(() => {
            task.wait(6);
            print(123);
            this.SetValue(player, 'Stats.Money', math.random(0, 100));
            task.wait(4);
            print(123);
            this.SetValue(player, 'Stats.Money', math.random(0, 100));
            task.wait(1);
            print('Insert');
            this.ArrayInsert(player, 'Stats.Items', 'Hello');
            task.wait(1);
            print('Insert');
            this.ArrayInsert(player, 'Stats.Items', 'Worl');
            task.wait(1);
            print('Set');
            this.ArraySet(player, 'Stats.Items', 1, 'World');
            task.wait(1);
            print('Remove');
            this.ArrayRemove(player, 'Stats.Items', 1);
            print(this.getReplica(player));
            task.wait(5);
            this.SetValue('All', 'Stats.Money', math.random(0, 100));
        })

        return {
            Stats: {
                Money: 1,
                Items: []
            }
        }
    }

    protected OnStart() {

        
    }
}