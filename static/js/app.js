let form = $('#form');

let shipment = {
  boxes: []
};

let boxCount = 0;
let itemCount = 0;
let boxes = {};
let shipment_id = $("#shipment-id").val();
let totalUnitCount = parseInt($("#unit-count").val());

$(".shipment-id-title").html(shipment_id);
$("#unit-id-title").html("Shipment ID: " + shipment_id);

(function ($) {
  $.each(['show', 'hide'], function (i, ev) {
    var el = $.fn[ev];
    $.fn[ev] = function () {
      this.trigger(ev);
      el.apply(this, arguments);
      return el;
    };
  });
})(jQuery);

$("#scan-item-fs").on("show", function(){
  console.log("scan-item-fs show")
  ScannerApp.activateScanner();
});

$("#scan-item-fs").on("hide", function(){
  console.log("scan-item-fs hide")
  // ScannerApp.deactivateScanner();
});

$('#start-packing').click(startPacking);
$('#scan-item').click(confirmScan);
$('#skip-scan').click(skipScan);
$('.review-box').click(reviewBox);
$('#add-box').click(addBox);
$('.add-item').click(addItem);
$('#box-info').click(boxInfo);
$('#finish-box').click(finishBox);
$('#finish-shipment').click(finishShipment);

function startPacking() {
  boxes[boxCount] = {box_number: boxCount,items: [], weight: 0, height: 0, length: 0, width: 0};
  segueFieldSet($("#start-packing-fs"), $("#scan-item-fs"));
}

function addBox() {
  boxes[boxCount] = {box_number: boxCount, items: [], weight: 0, height: 0, length: 0, width: 0};
  $("#box-scan-number").html("Box " + (boxCount + 1));
  segueFieldSet($("#complete-shipment-fs"), $("#scan-item-fs"));
}

function addItem() {
  let srcFs = $(this).parent();
  segueFieldSet(srcFs, $("#scan-item-fs"));
}

function skipScan() {
  $("#item-upc").html("");
  segueFieldSet($("#scan-item-fs"), $("#item-confirmation-fs"));
}

function confirmScan() {
  let items = boxes[boxCount].items;
  let upc = $("#current-upc").val();
  items.push({
    UPC: upc,
    quantity: 1
  });
  itemCount += 1;
  $("#item-upc").html("<div>Item UPC: " + upc + " succesfully added!</div>");
  segueFieldSet($("#scan-item-fs"), $("#item-confirmation-fs"));
}

function reviewBox() {
  let items = boxes[boxCount].items;
  let inner = $("<div></div>");
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    inner.append("<div>UPC: " + item.UPC + "</div>");
  }

  $("#box-summary").html(inner);

  let srcFs = $(this).parent();
  segueFieldSet(srcFs, $("#box-review-fs"));
}

function boxInfo() {
  segueFieldSet($("#box-review-fs"), $("#box-info-fs"));
}

function finishBox() {
  boxes[boxCount]["weight"] = parseInt($("#box-weight").val());
  boxes[boxCount]["height"] = parseInt($("#box-height").val());
  boxes[boxCount]["length"] = parseInt($("#box-length").val());
  boxes[boxCount]["width"]  = parseInt($("#box-width").val());

  $("#units-packed").html("Units Packed: " + itemCount  + " / " + totalUnitCount);
  $("#shipment-summary").append("<div>Box: " + (boxCount + 1) + "</div>");
  boxCount += 1;
  segueFieldSet($("#box-info-fs"), $("#complete-shipment-fs"));
}

function finishShipment() {
  for(let i = 0; i < boxCount; i++) {
    shipment.boxes.push(boxes[i]);
  }
  console.log(shipment);
  $.ajax({
      url: "/shipments/complete",
      type: "post",
      dataType: "json",
      contentType: 'application/json',
      data: JSON.stringify(shipment.boxes),
      success: function (response) {
         // You will get response from your PHP page (what you echo or print)
        segueFieldSet($("#complete-shipment-fs"), $("#shipment-confirmation-fs"));
      },
      error: function(jqXHR, textStatus, errorThrown) {
          alert("Could not complete shipment");
          segueFieldSet($("#complete-shipment-fs"), $("#shipment-confirmation-fs"));
          console.log(textStatus, errorThrown);
      }
   });
}
