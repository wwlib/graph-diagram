import Model from './Model';
import Entity from './Entity';
import Node from './Node';
import Relationship from './Relationship';

export default class ModelToCypher {

  static convert(model: Model): any {
    var statements: any[] = [];
    model.nodeList().forEach((node: Node) => {
        statements.push("(" + ModelToCypher.quote(node.id) +" :" + ModelToCypher.quote(node.caption || "Node") + " " + ModelToCypher.render(ModelToCypher.props(node)) + ") ");
    });
    model.relationshipList().forEach((rel: Relationship) =>{
        statements.push("(" + ModelToCypher.quote(rel.start.id) +
            ")-[:`" + ModelToCypher.quote(rel.relationshipType||"RELATED_TO") +
            "` " + ModelToCypher.render(ModelToCypher.props(rel)) +
            "]->("+ ModelToCypher.quote(rel.end.id) +")"
        );
    });
    if (statements.length==0) return "";
    return "CREATE \n  " + statements.join(",\n  ");
  }

  static props(element: Entity) {
      var props = {};
      element.properties.list().forEach((property: any) => {
          props[property.key] = property.value;
      });
      return props;
  }

  static isIdentifier(name: string) {
      return /^[_a-zA-Z]\w*$/.test(name);
  }

  static quote(name: string) {
      return ModelToCypher.isIdentifier(name) ? name : "`" + name + "`";
  }

  static render(props: any) {
      var res = "";
      for (var key in props) {
          if (res.length > 0) res += ",";
          if (props.hasOwnProperty(key)) {
              res += ModelToCypher.quote(key) + ":";
              var value = props[key];
              res += typeof value == "string" && value[0] != "'" && value[0] != '"' ? "'" + value + "'" : value;
          }
      }
      return res.length == 0 ? "" : "{" + res + "}";
  }
}
