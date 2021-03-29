import {
  Model,
  Node,
  Relationship
} from '../..';

import { DataTypes, d3Types } from "./DataTypes";

export default class ModelToD3 {

  public dataTypes: DataTypes = new DataTypes(); // included to force DataTypes to be included in d.ts

  static convert(model: Model): d3Types.d3Graph {
    let graph:  d3Types.d3Graph = {
      nodes: [],
      links: []
    };

    model.nodeList().forEach((node: Node) => {
        let nodeData:  d3Types.d3Node = {
          id: node.id,
          group: 1,
          properties: node.properties.toJSON(),
          labels: [node.caption],
          position: node.position
        }
        graph.nodes.push(nodeData);
    });

    model.relationshipList().forEach((relationship: Relationship) => {
      if (relationship.start && relationship.end) {
        let relationshipData:  d3Types.d3Link = {
          source: relationship.start.id,
          target: relationship.end.id,
          value: 1,
          id: relationship.id,
          type: relationship.relationshipType,
          startNode: relationship.start.id,
          endNode: relationship.end.id,
          properties: relationship.properties.toJSON(),
          linknum: 1
      }
      graph.links.push(relationshipData);
      }
    });

    return graph;
  }

  static parseD3(data: any, modelId?: string, origin?: {x: number, y: number}) {
      var model: Model = new Model(modelId);

      data.nodes.forEach((nodeData: any) =>  {
          let newNode: Node = model.createNode(nodeData.id);
          if (origin) {
              newNode.x = origin.x;
              newNode.y = origin.y;
          }
          if (nodeData.position && nodeData.position.x && nodeData.position.y) {
              newNode.x = nodeData.position.x;
              newNode.y = nodeData.position.y;
          }
          newNode.caption = nodeData.labels[0];
          let properties: any = nodeData.properties;
          for (let key in properties) {
              if (properties.hasOwnProperty(key)) {
                  newNode.properties.set(key, properties[key])
              }
          }
      });

      data.links.forEach((linkData: any) =>  {
        let fromId = linkData.startNode;
        let toId = linkData.endNode;
        let newRelationship: Relationship = model.createRelationship(model.lookupNode(fromId), model.lookupNode(toId), linkData.id);
        newRelationship.relationshipType = linkData.type;
        let properties: any = linkData.properties;
        for (let key in properties) {
            if (properties.hasOwnProperty(key)) {
                newRelationship.properties.set(key, properties[key])
            }
        }
      });

      return model;
  }

  static mergeD3(data1: any, data2: any): any {
    let result: any = { nodes: [], links: []};
    const data1Nodes: any[] = data1.nodes;
    const data2Nodes: any[] = data2.nodes;
    const data1Links: any[] = data1.links;
    const data2Links: any[] = data2.links;

    if (Array.isArray(data1Nodes) && Array.isArray(data2Nodes) && Array.isArray(data1Links) && Array.isArray(data2Links)) {
      const nodes: any[] = data1Nodes.concat(data2Nodes);
      const links: any[] = data1Links.concat(data2Links);
      result = {
        nodes,
        links
      }
    }
    return result;
  }
}
