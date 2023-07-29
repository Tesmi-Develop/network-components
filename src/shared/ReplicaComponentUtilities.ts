export const stringPathToArray = (path: string) => {
    return path.split('.');
}

export const SetValue = (data: object, pathArray: string[], value: unknown) => {
    let pointer = data;

    for (const i of $range(1, pathArray.size() - 1)) {
        pointer = pointer[pathArray[i - 1] as never] as never;
    }

    const oldData = pointer[pathArray[pathArray.size() - 1 as never] as never];

    pointer[pathArray[pathArray.size() - 1 as never] as never] = value as never;

    return oldData;
}

export const ArrayInsert = (data: object, pathArray: string[], value: defined) => {
    let pointer = data;

    for (const i of $range(1, pathArray.size())) {
        pointer = pointer[pathArray[i - 1] as never] as never;
    }

    return (pointer as defined[]).push(value);
}

export const ArraySet = (data: object, pathArray: string[], index: number, value: defined) => {
    let pointer = data;

    for (const i of $range(1, pathArray.size())) {
        pointer = pointer[pathArray[i - 1] as never] as never;
    }

    if ((pointer as defined[])[index] === undefined) {
        error("[ReplicaComponent]: ArraySet() can only be used for existing indexes");
    }

    (pointer as defined[])[index] = value;
}

export const ArrayRemove = (data: object, pathArray: string[], index: number) => {
    let pointer = data;

    for (const i of $range(1, pathArray.size())) {
        pointer = pointer[pathArray[i - 1] as never] as never;
    }

    return (pointer as defined[]).remove(index);
}

export const ArrayPathToString = (path: string[]) => {
    return path.join('.');
}