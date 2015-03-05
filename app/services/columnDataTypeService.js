app.factory('columnDataTypeService', function () {

    var global = {};

    global.getcolumnDataTypes = function(){
        return[
            {
              name : 'Text',
              text : 'Text',
              type:'static',
              visible: true
            },
            {
              name : 'Email',
              text : 'Email',
              type:'static',
              visible: true
            },
            {
              name : 'URL',
              text : 'URL',
              type:'static',
              visible: true
            },
            {
              name : 'Number',
              text : 'Number',
               type: 'static',
               visible: true
            },
            {
              name : 'Password',
              text : 'Password',
              type: 'static',
              visible: false
            },
            {
              name : 'Boolean',
              text : 'Boolean',
              type: 'static',
              visible: true
            },
            {
              name : 'DateTime',
              text : 'Date Time',
              type: 'static',
              visible: true
            },
            {
              name : 'Id',
              text : 'ID',
              type: 'static',
              visible: false
            },
            {
              name : 'ACL',
              text : 'ACL',
              type: 'static',
              visible: false
            },
            {
              name : 'List',
              text : 'List',
              type: 'List',
              visible: true
            },
            {
              name : 'Relation',
              text : 'Relation',
              type: 'Realtion',
              visible: true
            },
            {
              name : 'Object',
              text : 'Object',
              type: 'static',
              visible: true
            }

        ]

    };

    return global;
});
