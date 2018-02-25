export declare namespace d3Types {
    type d3Node = {
        id: string;
        group?: number;
        properties?: any;
        labels?: string[];
    };
    type d3Link = {
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
    type d3Graph = {
        nodes: d3Node[];
        links: d3Link[];
    };
}
export declare class DataTypes {
}
