"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

var myFormData = [];

var schemaName = serverData.parameters.schema.toLowerCase()

var appName = serverData.menus.app.name;

var type = serverData.parameters.schema;
var dataType = serverData.parameters.schema;

var adminUrl = serverData.service.admin.services[0].url;

var ref = `/app/${appName}/data?schema=${type}`;

for (let searchItemNumber in serverData.service.admin.schema.search) {
  let searchItem = serverData.service.admin.schema.search[searchItemNumber];
  let fullSearchItem = {
    data: searchItem.name + '',
    className: searchItem.css + 'align-middle',
    orderable: searchItem.orderable,
    searchable: searchItem.searchable
  };
  myFormData.push(fullSearchItem);
}

// Advance DataTables Demo
// =============================================================
var AdvanceDataTablesDemo = /*#__PURE__*/function () {
  function AdvanceDataTablesDemo() {
    _classCallCheck(this, AdvanceDataTablesDemo);

    this.init();
  }

  _createClass(AdvanceDataTablesDemo, [{
    key: "init",
    value: function init() {
      // event handlers
      this.table = this.table();
      this.globalSearch();
      this.columnSearch();
      this.selecter();
      this.clearSelected(); // filter columns

      this.addFilterRow();
      this.removeFilterRow();
      this.clearFilter(); // add buttons

      this.table.buttons().container().appendTo('#dt-buttons').unwrap();
    }
  }, {
    key: "table",
    value: function table() {
      return $('#myTable').DataTable({
        dom: "<'text-muted'Bi>\n        <'table-responsive'tr>\n        <'mt-4'p>",
        buttons: ['copyHtml5', {
          extend: 'print',
          autoPrint: false
        }],
        language: {
          paginate: {
            previous: '<i class="fa fa-lg fa-angle-left"></i>',
            next: '<i class="fa fa-lg fa-angle-right"></i>'
          }
        },
        autoWidth: false,
        ajax: {
          "url": adminUrl + '/' + schemaName + 's/?format=data',
          "type": "GET",
          "beforeSend": function(xhr){
            xhr.setRequestHeader("Authorization", "Bearer " + getCookie('idx'))
            xhr.setRequestHeader("Content-Type", "application/json"
            );
          }
        },
        deferRender: true,
        order: [1, 'asc'],
        columns: myFormData,
        columnDefs: [{
          targets: 0,
          render: function render(data, type, row, meta) {
            return "<div class=\"custom-control custom-control-nolabel custom-checkbox\">\n            <input type=\"checkbox\" class=\"custom-control-input\" name=\"selectedRow[]\" id=\"p".concat(row.id, "\" value=\"").concat(row.id, "\">\n            <label class=\"custom-control-label\" for=\"p").concat(row.id, "\"></label>\n          </div>");
          }
        }, {
          targets: 1,
          render: function render(data, type, row, meta) {
            let itemName = row.name;
            if (itemName === undefined) {
              itemName = row.text;
            }
            if (row.picture !== undefined) {
              return "<a href=\"item?schema=" + dataType + "&id=".concat(row.id, "\" class=\"tile tile-img mr-1\">\n            <img class=\"img-fluid\" src=\"").concat(row.picture, "\" alt=\"row image\">\n          </a>\n          <a href=\"item?schema=" + dataType + "&id=").concat(row.id, "\">").concat(row.name, "</a>");
            } else {
              return "<li class=\"list-group-item\" style='padding: 1px'>\n" +
                  "                          <div class=\"list-group-item-figure\">\n" +
                  "                            <div class=\"tile bg-primary\">\n" +
                  "                              <span class=\"" + row.icon + "\"></span>\n" +
                  "                            </div>\n" +
                  "                          </div>\n" +
                  "                          <div class=\"list-group-item-body\"> <a href='item?schema=" + dataType + "&id=" + row.id + "\'>" + itemName + " </div></a>\n" +
                  "                        </li>";
            }
          }
        },
          {
            targets: serverData.service.admin.schema.search.length,
            render: function render(data, type, row, meta) {
              return "";
            }
          },
          {
          targets: serverData.service.admin.schema.search.length+1,
          render: function render(data, type, row, meta) {
            return "<a class=\"btn btn-sm btn-icon btn-secondary\" href=\"item?schema=" + dataType + "&id=".concat(row.id, "\"><i class=\"fa fa-pencil-alt\"></i></a>\n          <a class=\"btn btn-sm btn-icon btn-secondary\" href=\"#\" data-toggle=\"modal\" onClick=\"displayValues('" + row.id + "','" + row.name + "')\" data-target=\"#confirmDelete\"").concat(row.id, "\"><i class=\"far fa-trash-alt\"></i></a>");
          }
        }]
      });
    }
  }, {
    key: "globalSearch",
    value: function globalSearch() {
      var self = this;
      $('#table-search').on('keyup focus', function (e) {
        var value = $('#table-search').val(); // clear selected rows

        if (value.length && e.type === 'keyup') {
          self.clearSelectedRows();
        }

        self.table.search(value).draw();
      });
    }
  }, {
    key: "columnSearch",
    value: function columnSearch() {
      var self = this;
      $(document).on('keyup change', '.filter-control', function (e) {
        var filterRow = $(this).parents('.form-row');
        var column = filterRow.find('.filter-column').val();
        var value = filterRow.find('.filter-value').val();
        var operator = value === '' ? 'contain' : filterRow.find('.filter-operator').val();
        var pattern = value;
        var exp = '';

        if (operator === 'notcontain') {
          pattern = '^((?!' + value + ').)*$';
        } else if (operator === 'equal') {
          pattern = '^' + value + '$';
        } else if (operator === 'notequal') {
          pattern = '^(?!' + value + ').*$';
        } else if (operator === 'beginwith') {
          pattern = '^(' + value + '| ' + value + ').*';
        } else if (operator === 'endwith') {
          pattern = '.*' + value + '$';
        } else if (operator === 'greaterthan') {
          var arr = value.split('');
          $.each(arr, function (i, val) {
            exp += '[' + val + '-9]';
          });
          pattern = '^(' + exp + '|[0-9][0-9]{' + arr.length + ',})*$';
        } else if (operator === 'lessthan') {
          (function () {
            var arr = value.split('');
            var lastIndex = arr.length - 1;

            var _loop = function _loop(x) {
              exp += x > 0 ? '|' : '';
              $.each(arr, function (i, val) {
                if (i <= x && x === lastIndex) {
                  exp += '[0-' + val + ']';
                }

                if (i <= x && x < lastIndex) {
                  exp += '[0-9]';
                }
              });
            };

            for (var x = 0; x < arr.length; x++) {
              _loop(x);
            }

            pattern = '^(' + exp + ')$';
          })();
        } // reset search term


        if (e.type === 'change' && $(e.target).is('select')) {
          filterRow.find('.filter-value').val('').trigger('keyup');
        }

        self.table.column(column).search(pattern, true, true).draw();
      });
    }
  }, {
    key: "addFilterRow",
    value: function addFilterRow() {
      $('#add-filter-row').on('click', function () {
        // get template from #filter-columns
        var rowTmpl = $('#filter-columns').children().first().clone();
        rowTmpl.find('select').prop('selectedIndex', 0);
        rowTmpl.find('input').val('');
        $('#filter-columns').append(rowTmpl);
      });
    }
  }, {
    key: "removeFilterRow",
    value: function removeFilterRow() {
      var self = this;
      $(document).on('click', '.remove-filter-row', function () {
        // get filter row
        var $row = $(this).parents('.filter-row'); // clear search value

        $row.find('.filter-value').val('').trigger('keyup'); // remove row

        if (self.isRemovableRow()) {
          $row.remove();
        }
      });
    }
  }, {
    key: "isRemovableRow",
    value: function isRemovableRow() {
      return $('#filter-columns').children().length > 1;
    }
  }, {
    key: "clearFilter",
    value: function clearFilter() {
      var self = this;
      $(document).on('click', '#clear-filter', function () {
        // hide modal
        $('#modalFilterColumns').modal('hide'); // reset selects and input

        $('#filter-columns').find('select').prop('selectedIndex', 0);
        $('#filter-columns').find('input').val(''); // reset search term

        self.table.columns().search('').draw();
      });
    }
  }, {
    key: "selecter",
    value: function selecter() {
      var self = this;
      $(document).on('change', '#check-handle', function () {
        var isChecked = $(this).prop('checked');
        $('input[name="selectedRow[]"]').prop('checked', isChecked); // get info

        self.getSelectedInfo();
      }).on('change', 'input[name="selectedRow[]"]', function () {
        var $selectors = $('input[name="selectedRow[]"]');
        var $selectedRow = $('input[name="selectedRow[]"]:checked').length;
        var prop = $selectedRow === $selectors.length ? 'checked' : 'indeterminate'; // reset props

        $('#check-handle').prop('indeterminate', false).prop('checked', false);

        if ($selectedRow) {
          $('#check-handle').prop(prop, true);
        } // get info


        self.getSelectedInfo();
      });
    }
  }, {
    key: "clearSelected",
    value: function clearSelected() {
      var self = this; // clear selected rows

      $('#myTable').on('page.dt', function () {
        self.clearSelectedRows();
      });
      $('#clear-search').on('click', function () {
        self.clearSelectedRows();
      });
    }
  }, {
    key: "getSelectedInfo",
    value: function getSelectedInfo() {
      var $selectedRow = $('input[name="selectedRow[]"]:checked').length;
      var $info = $('.thead-btn');
      var $badge = $('<span/>').addClass('selected-row-info text-muted pl-1').text("".concat($selectedRow, " selected")); // remove existing info

      $('.selected-row-info').remove(); // add current info

      if ($selectedRow) {
        $info.prepend($badge);
      }
    }
  }, {
    key: "clearSelectedRows",
    value: function clearSelectedRows() {
      $('#check-handle').prop('indeterminate', false).prop('checked', false).trigger('change');
    }
  }]);

  return AdvanceDataTablesDemo;
}();
/**
 * Keep in mind that your scripts may not always be executed after the theme is completely ready,
 * you might need to observe the `theme:load` event to make sure your scripts are executed after the theme is ready.
 */

var deleteObject = "N/A";

function displayValues(id, name){
  deleteObject = id;
  $('#confirmTitle').text("Warning: Confirm delete of '" + name + "'");
}

function deleteItem(){
  console.log('should delete: <%= context.data.admin.service %>/<%= context.parameters.schema.toLowerCase() %>s/delete/' + deleteObject);
}

$(document).on('theme:init', function () {
  new AdvanceDataTablesDemo();
});