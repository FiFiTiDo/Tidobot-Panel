type BooleanCallback = (where: Where) => void;
export type PreparedColumn = {
    column: string,
    key: string,
    value: any
}
type PreparedData = PreparedColumn[];

abstract class BooleanOperation {
    abstract toString(): string;
    abstract getPreparedData(): PreparedData;
}

class RawSql extends BooleanOperation {
    constructor(private readonly sql: string) {
        super();
    }

    toString(): string {
        return this.sql;
    }

    getPreparedData(): PreparedColumn[] {
        return [];
    }
}

class BinaryOperation extends BooleanOperation {
    constructor(private readonly sep: string, private readonly data: BooleanOperation[]) {
        super();
    }

    toString(): string {
        if (this.data.length === 1) return this.data[0].toString();
        return "(" + this.data.map(data => data.toString()).join(` ${this.sep} `) + ")";
    }

    getPreparedData(): PreparedData {
        return this.data.reduce<PreparedData>((prev, curr) => prev.concat(curr.getPreparedData()), []);
    }
}

class AndExpression extends BinaryOperation {
    constructor(data: BooleanOperation[]) {
        super("AND", data);
    }
}

class OrExpression extends BinaryOperation {
    constructor(data: BooleanOperation[]) {
        super("OR", data);
    }
}

class InExpression extends BooleanOperation {
    constructor(private readonly column: string, private possible: any[]) {
        super();
    }

    toString(): string {
        return `${this.column} IN ${this.possible.join(',')}`;
    }

    getPreparedData(): PreparedData {
        return [];
    }
}

class NotInExpression extends BooleanOperation {
    constructor(private readonly column: string, private possible: any[]) {
        super();
    }

    toString(): string {
        return `${this.column} NOT IN ${this.possible.join(',')}`;
    }

    getPreparedData(): PreparedData {
        return [];
    }
}

class EqualsExpression extends BooleanOperation {
    constructor(private readonly data: PreparedColumn) {
        super();
    }

    toString(): string {
        return `${this.data.column} = ${this.data.key}`;
    }

    getPreparedData(): PreparedData {
        return [this.data];
    }
}

export class Where {
    private readonly data: BooleanOperation[];
    private readonly preparedValues: { [key: string]: any };

    constructor(private parent: Where = null) {
        this.data = [];
        this.preparedValues = {};
    }

    addPreparedValue(column: string, value: any): PreparedColumn {
        if (this.parent !== null) return this.parent.addPreparedValue(column, value);

        let base_key = "$" + column;
        let key = base_key;
        let i = 0;
        while (this.preparedValues.hasOwnProperty(key)) {
            key = base_key + (++i);
        }
        this.preparedValues[key] = value;

        return { key, column, value };
    }

    and(func: BooleanCallback): this {
        let where = new Where(this);
        func.call(null, where);
        this.add(new AndExpression(where.getData()));
        return this;
    }

    or(func: BooleanCallback): this {
        let where = new Where(this);
        func.call(null, where);
        this.add(new OrExpression(where.getData()));
        return this;
    }

    eq(column: string, value: any): this {
        this.add(new EqualsExpression(this.addPreparedValue(column, value)));
        return this;
    }

    in(column: string, possible: any[]): this {
        this.add(new InExpression(column, possible));
        return this;
    }

    notIn(column: string, possible: any[]): this {
        this.add(new NotInExpression(column, possible));
        return this;
    }

    raw(sql: string): this {
        this.add(new RawSql(sql));
        return this;
    }

    add(op: BooleanOperation): this {
        this.data.push(op);
        return this;
    }

    addAll(ops: BooleanOperation[]): this {
        ops.forEach(this.add);
        return this;
    }

    toString(): string {
        if (this.data.length < 1) return "";
        return " WHERE " + new AndExpression(this.data).toString();
    }

    getData(): BooleanOperation[] {
        return this.data;
    }

    getPreparedValues(): { [key: string]: any } {
        return this.preparedValues;
    }
}

export function where() {
    return new Where();
}