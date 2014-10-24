//////////////////////////////////////////////////////////////////////////////////////////
// Released under the [MIT License](http://www.opensource.org/licenses/mit-license.php).//
// Author: 2014 Juan Chamizo González                                                   //
//////////////////////////////////////////////////////////////////////////////////////////


//underscore.string no conflict
_.mixin(_.str.exports());
json2TableList = function(data, dest, options) {
    userOptions = options || {}
    //default configuration
    this.config = {
        rowsId: "_id", //(String) El nombre de la clave(column) que se va  aponer como id a cada fila, por defecto el nombre de identificador de las collecciones en MongoDb
        showRowIdColumn: false, //(true || false)  Renderiza o no la celda correspondiente a la columna clave (rowsId:) Default = false
        title: false, //Sí se indica inserta un DIV con el titulo indicado. automáticamente le asigna las clase "table_title" y "autol". Default false
        tableClass: false, //String || false Establece una clase(s) para la tabla en caso de que se hayan indicado. Default false. Separar las clases por un espacio.
        cellDateFormat: 'DD MM YYYY', //Usa momentjs
        fieldSort: false, // Array Determina el order en el que aparecen los campos, si es false, segun estén en el objeto. Si se indica solo
        createCellClassLimit: 10, //Asigna a cada celda una class igual a su contenido, con el filtro _.slugify() , de underscore_strings de modo que a una celda con el contenido "Jose-Luis" le asignaría  la clase jose-luis. Siempre que el tamaño de la cadena sea igual o inferior al valor indicado. Default 10. False lo desactiva.
        allowEvalCells: true, //boolean Activa o desactiva la posibilidad de pasar eval al contenido de las celdas que se han definido mediante "eval [algo a evaluar]"
        sortable: true, //TODO Hacerla Sortable
        filterable: true, //TODO Hacerla filterable
        calculateColumns: false //Es un array con objetos json, que definen los que se espera en las columnas a calcular ej: [{column: 'col1', operation:'sum', precision:2}, {column: 'col2', operation:'avg'}]  Los valores 'column' y 'operation' para cada columna son obligatorios. 'precision' es opcional default 0
    }
    $.each(userOptions, function(key) {
        config[key] = userOptions[key]
    })
    // Evalua en Javascript la cadena pasada por @cadena
    // @param cadena Una cadena que debe comenzar por "eval ..." (notese el espacio). Si la cadena es "eval new Date()" devolverá una fecha.
    // @return Depende de lo que evalue o la mima cadena que ha recibido si no se ha pasado eval
    function autolParseEval(cadena) {
        if (!config.allowEvalCells) {
            return cadena;
        }
        if (_(cadena).strLeft(' ') !== 'eval') {
            return cadena
        }
        var toEvaluate = _(cadena).strRight(' ')
        return eval(toEvaluate)
    }
    //Renderiza un elemento simple de texto o número
    function simpleElement(cad) {
        var that = this
        var rType = $.type(cad) == 'date' ? moment(cad).format(config.cellDateFormat) : cad
        return $('<span>', {
            type: $.type(cad)
        }).text(autolParseEval(rType))
    }
    //Determina el tipo de elemento de que se trata y redirige a la función currespondiente
    function whatType(element) {
        var that = this
        if ($.inArray($.type(element), ['number', 'date', 'string', 'boolean']) >= 0) {
            return simpleElement(element)
        } else if ($.type(element) == 'array') {
            return arrayElement(element)
        } else if ($.type(element) == 'object') {
            return objectElement(element)
        }
    }
    //Marca EN PRIMERA INSTANCIA los elementos tipo "object"
    function objectElement(element) {
        var theDiv = $('<div>', {
            type: "object",
            source: JSON.stringify(element)
            /*,
               title: JSON.stringify(element)*/
        }) /*.text('Soy un objeto')*/
        return theDiv
    }
    //Renderiza los elementos tipo object
    function renderObjectElement(theObject) {
        var that = this
        var theTable = $('<table>')
        var theHead = $('<thead>').appendTo(theTable)
        var theHeadRow = $('<tr>').appendTo(theHead)
        var theRow = $('<tr>').appendTo(theTable)
        $.each(theObject, function(key) {
            var theCellHead = $('<td>').html(key).appendTo(theHeadRow)
            var theCell = $('<td>').html(whatType(theObject[key], {})).appendTo(theRow)
        })
        return theTable.html()
    }
    // renderiza los elementos tipo array
    function arrayElement(theArray) {
        var that = this
        var theDiv = $('<div>')
        theArray.forEach(function(key, index) {
            whatType(key).appendTo(theDiv).attr('index', index + 1).addClass('array_element')
        })
        return theDiv
    }
    /*
     * Parsea el contenido del array con objetos json en una tabla html, con recursividad infinita. Crea la tabla y recorre el objeto, creando, filas y columnas
     * @param dataArray Array Array de objetos JSON validos
     * @param dataDest  String Id del elemento dentro del cual va a renderizarse la tabla
     */
    function parseJson(dataArray, dataDest) {
        var that = this
        var theTable = $('<table>', {
            class: "autol"
        })

        if (config.tableClass) {
            theTable.addClass(config.tableClass)
        }

        var theHead = $('<thead>').appendTo(theTable)
        var theHeadRow = $('<tr>').appendTo(theHead)


        //Leeemos la configuración de orden de campos fieldsSort, si se ha establecido

        if (_.isArray(that.config.fieldsSort)) {

            //            console.log(that.config.fieldsSort)
            //            console.log(_.uniq(that.config.fieldsSort.concat(_.keys(dataArray[0]))))

            arrOrderedFields = _.uniq(that.config.fieldsSort.concat(_.keys(dataArray[0])))
            console.log(arrOrderedFields)

        } else {

            arrOrderedFields = _.keys(dataArray[0])
        }



        dataArray.forEach(function(rowKey, index) {
            var theRow = $('<tr>', {
                id: rowKey[that.config.rowsId]
            }).appendTo(theTable)
            if (that.config.showRowIdColumn === false) {
                delete rowKey[config.rowsId]
            }


            arrOrderedFields.forEach(function(cellKey) {
                if (rowKey[cellKey]) {
                    //console.log(cellKey)
                    if (index == 0) {
                        var theCellHead = $('<th>').text(cellKey).appendTo(theHeadRow).addClass(_.slugify('column-' + cellKey))
                    }
                    var theCell = $('<td>').html(whatType(rowKey[cellKey])).appendTo(theRow).addClass(_.slugify('column-' + cellKey))
                    //Si el valor es uno de los tipos indicados, y se ha indicado la propiedad createCellClassLimit entonces establecemos una clase para la celde con el contenido "slugificado". para ello formateamos los campos date antes de procesarlos
                    if (that.config.createCellClassLimit) {
                        var showType = $.type(rowKey[cellKey]) == 'date' ? moment(rowKey[cellKey]).format(that.config.cellDateFormat) : rowKey[cellKey]
                        if ($.inArray($.type(showType), ['number', 'date', 'string', 'boolean'] >= 0) && showType.toString().length <= that.config.createCellClassLimit) {
                            theCell.addClass(_.slugify(showType))
                        }
                    }
                }

            })





        })
        $('#' + dataDest).html('')
        if (that.config.title) {
            $('#' + dataDest).html('<div class="autol_table_title">' + that.config.title + '</div>')
        }
        theTable.appendTo($('#' + dataDest))
        //Recorremos lo elementos  que hemos marcado como objeto, recursivamente para renderizarlos
        while ($("div[type=object]", theTable).length >= 1) {
            $("div[type=object]", theTable).each(function() {
                src = JSON.parse($(this).attr("source"))
                $(this).html('<table class="object_table">' + renderObjectElement(src) + '</table>')
                $(this).attr("type", "renderObject")
                $(this).removeAttr("source")
            })
        }
        if (config.calculateColumns) {
            config.calculateColumns.forEach(function(key) {
                calculateColum(theTable, key.column, key.operation, key.precision || 0)
            })
        }
    }
    /* Muestra los totales para cada columna
     * @param theTable object jQuery
     * @param columName string La columna a renderizar
     * @param operation string {avg || sum} la operación a realizar
     * @param precision integer opcional Los decimales a mostrar
     */
    function calculateColum(theTable, columName, operation, precision) {
        if ($('tfoot', theTable).length == 0) {
            var theTfoot = $('<tfoot>').appendTo(theTable)
            $('thead tr:first', theTable).clone().appendTo(theTfoot)
            $('tfoot th', theTable).text('')
        }
        var nOk = []
        var theSum = 0
        var cells = $('td.column-' + columName, theTable)
        var countCell = cells.length
        cells.each(function() {
            if ($.isNumeric($(this).text())) {
                nOk.push($(this).text())
            }
        })
        var theCount = nOk.length
        nOk.forEach(function(key) {
            theSum = theSum + parseFloat(key)
            theAvg = theSum / theCount
        })
        var res = ''
        if (operation == 'sum') {
            res = theSum
        } else if (operation == 'avg') {
            res = theAvg
        }
        if (precision) {
            res = res.toFixed(precision)
        }
        var destCellRes = $('tfoot th.column-' + columName, theTable)
        var thecellRes = $('<div>', {
            operation: operation
        }).text(res).appendTo(destCellRes)
    }
    parseJson(data, dest)
}
