import { Component } from "@flamework/components";
import { ReplicaComponent } from "./Network/ReplicaComponent";

@Component({
    tag: 'Bank'
})
export class BankComponent extends ReplicaComponent<{}, Instance, 'TestData'> {
    protected OnStart() {
        this.ListenToChange('Stats.Money', (value, oldValue) => {
            print(value, oldValue);
        });
        this.ListenToArrayInsert('Stats.Items', (newIndex, newValue) => {
            print(newIndex, newValue);
        });
        this.ListenToArraySet('Stats.Items', (index, newValue) => {
            print(index, newValue);
        });
        this.ListenToArrayRemove('Stats.Items', (index, value) => {
            print(index, value);
            print(this.data)
        });
    }
}