export declare type d3Node = {
    id: string;
    group?: number;
    properties?: any;
    labels?: string[];
};
export declare type d3Link = {
    source: string;
    target: string;
    value?: number;
    id?: string;
    type?: string;
    startNode?: string;
    endNode?: string;
    properties?: any;
    linknum?: number;
};
export declare type d3Graph = {
    nodes: d3Node[];
    links: d3Link[];
};
export declare class DataTypes {
}
