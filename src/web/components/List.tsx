import {observer} from "mobx-react";
import {Component} from "react";

export interface ListProps<T> {
    values: Iterable<T> | T[];
    map: (value: T) => JSX.Element | JSX.Element[];
    filter?: (value: T) => boolean;
}

@observer
export class List<T> extends Component<ListProps<T>> {
    public render() {
        const {values, map, filter} = this.props;
        const results = [];
        for (const value of values) {
            if (!filter || filter(value)) {
                const mapped = map(value);
                if (Array.isArray(mapped)) {
                    results.push(...mapped);
                } else {
                    results.push(mapped);
                }
            }
        }
        return results;
    }
}