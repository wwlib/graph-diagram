export default class SimpleStyle {

    private _styles: any;

    constructor(stylePrototype?: SimpleStyle | any) {
        this._styles = {};

        if (stylePrototype && (stylePrototype instanceof SimpleStyle)) {
            let styleMap = stylePrototype.style();
            // console.log(`styleMap:`, styleMap);
            for (let key in styleMap) {
                if (styleMap.hasOwnProperty(key)) {
                    this._styles[key] = styleMap[key];
                }
            }
        } else {
            let styleMap = stylePrototype;
            // console.log(`styleMap:`, styleMap);
            for (let key in styleMap) {
                this._styles[key] = styleMap[key];
            }
        }
    }

    style(cssPropertyKey?: string, cssPropertyValue?: string): any {
        // console.log(`SimpleStyle: style: ${cssPropertyKey}, ${cssPropertyValue}`, arguments, this);
        if (cssPropertyKey && cssPropertyValue) { //(arguments.length == 2) {
            this._styles[cssPropertyKey] = cssPropertyValue;
            return this;
        } else if (cssPropertyKey) { //(arguments.length == 1) {
            return this._styles[cssPropertyKey];
        } else {
            return this._styles;
        }
    }

    static copyStyle( entity: any, computedStyle: any, cssPropertyKey: string, backupCssPropertyKey?: string, debug: boolean = false )
    {
        var propertyValue = computedStyle.getPropertyValue( cssPropertyKey );
        if ( !propertyValue )
        {
            propertyValue = computedStyle.getPropertyValue( backupCssPropertyKey );
        }
        if (debug) {
            console.log(`  ${cssPropertyKey}: ${propertyValue}`);
        }
        entity.style( cssPropertyKey, propertyValue );
    }

    static copyStyles( entity: any, markup: any, debug: boolean = false )
    {
        var computedStyle: any = window.getComputedStyle(markup.node() );
        if (debug) {
            console.log(`copyStyles from: `, markup.node());
        }
        SimpleStyle.copyStyle( entity, computedStyle, "width", "width", debug );
        SimpleStyle.copyStyle( entity, computedStyle, "min-width", "min-width", debug );
        SimpleStyle.copyStyle( entity, computedStyle, "font-family", "font-family", debug );
        SimpleStyle.copyStyle( entity, computedStyle, "font-size", "font-size", debug );
        SimpleStyle.copyStyle( entity, computedStyle, "margin", "margin-top", debug );
        SimpleStyle.copyStyle( entity, computedStyle, "padding", "padding-top", debug );
        SimpleStyle.copyStyle( entity, computedStyle, "color", "color", debug );
        SimpleStyle.copyStyle( entity, computedStyle, "background-color", "background-color", debug );
        SimpleStyle.copyStyle( entity, computedStyle, "border-width", "border-top-width", debug );
        SimpleStyle.copyStyle( entity, computedStyle, "border-style", "border-top-style", debug );
        SimpleStyle.copyStyle( entity, computedStyle, "border-color", "border-top-color", debug );
    }

}

// export default class SimpleStyle {
//     private _style: any;
//
//     constructor(stylePrototype?: any) {
//         this._style = this.styleSet(stylePrototype);
//     }
//
//     get style(): any {
//         return this._style;
//     }
//
//     styleSet(stylePrototype?: any) {
//         var styles = {};
//
//         if (stylePrototype) {
//             var styleMap = stylePrototype.style();
//             for (var key in styleMap) {
//                 if (styleMap.hasOwnProperty(key)) {
//                     styles[key] = styleMap[key];
//                 }
//             }
//         }
//
//         return function(cssPropertyKey: string, cssPropertyValue: string) {
//             if (arguments.length == 2) {
//                 styles[cssPropertyKey] = cssPropertyValue;
//                 return this;
//             }
//             if (arguments.length == 1) {
//                 return styles[cssPropertyKey];
//             }
//             return styles;
//         }
//     }
// }
