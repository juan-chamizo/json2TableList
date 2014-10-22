#json2TableList

##Description
A simple Javascript way to convert an object array in a html table, every json object is a row in the table. 

##Instalation
At this moment you must download del main file (/lib/json2TableList.js) a refer to it in  your Javascript code. 

Optionaly yo can use the json2TableList.css file. 

##Usage

```js      
    json2TableList(data, dest,  [options])

```
###data (required)


An array Javascript object. Each object in teh array will be render to a row in the table. 


for example:
```js
    [
        {"a": 1,"b": 2,"c": [1,2,3,4],"d": {"first": "John","last": "Doe"},"f": new Date()},
        {"a": 6,"b": 7,"c": [8,9,10,11],"d": {"first": "Mary","last": "Land"},"f": new Date()}
    [
```
    
###dest (required)
    
The _id_ of a div. The result table, will be put inside.
    
###options (optional)
This is the default set options, and this is the format:
```js
    {
        rowsId: "_id",
        showRowIdColumn: false,
        title: false,
        tableClass: false,
        cellDateFormat: "DD MM YYYY",
        createCellClassLimit: 10,
        allowEvalCells: true,
        sortable: true, 
        filterable: true, 
        calculateColumns: false
    }


```

| Tables   |      Are      |  Cool |
|----------|:-------------:|------:|
| col 1 is |  left-aligned | $1600 |
| col 2 is |    centered   |   $12 |
| col 3 is | right-aligned |    $1 |



|option|default|posible values|description|examples|



|rowsId| _id| String| The name of the key (column) that will be the row id in each &lt;tr&gt; in the result table. If the column name don't exist, will have no effect. |{rowsId:'name'}|




|showRowIdColumn| false| _true_ or _false_ |  Create or not a column _TD_ for the key _rowId_  Default = false|{<br>showRowIdColumn:true<br>}|
|title|false|String|If indicated showing a title in the table|{title:"This a table title"}
|tableClass|false|String|Set a class in the table, Separate the class name with a space | {tableClass:"my-class myotherclass"}|
|cellDateFormat| 'DD MM YYYY' |String| Use de momentjs date format  http://momentjs.com|{cellDateFormat:"DD/MM/YYYY"}|
|createCellClassLimit|10|Int or false|Set each cell with a class equal to content, for example: a cell with content "woman" create _class=woman_. Whenever the size of the content is less than or equal to _createCellClassLimit_. If set, the content is _slugify_|{createCellClassLimit: 20}<br>{createCellClassLimit: false}|
|allowEvalCells|true|true or false|Allow parse javascript code in the content. The sintax is: <br>'_eval "IAmAString".toUpperCase()_'(Note one space after _eval_ )|{allowEvalCells:false}|




|calculateColumns| false | false or Object definition|Define the opetarion for numeric columns. Precision is optional and indicate the decimal positions.|{"calculateColumns":[<br>{column: "a",operation: "sum"},<br>{column: "b",operation: "avg",precision:3}<br>]}|

##Examples

In the demo page in http://jotakaele.github.io/json2TableList/

##Dependencies

-   jQuery
-   underscore
-   underscore.strings
-   momentjs

##Author
- Juan Chamizo González
- juan.chamizo@gmail.com
- @juan_chamizo

##License
Released under the [MIT License](http://www.opensource.org/licenses/mit-license.php).

