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

$('#start-packing').click(startPacking);
$('#scan-item').click(confirmScan);
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

function confirmScan() {
  let items = boxes[boxCount].items;
  items.push({
    upc: itemCount,
    quantity: 1
  });
  $("#item-upc").html("<div>Item UPC: " + itemCount + " succesfully added!</div>");
  itemCount += 1;
  segueFieldSet($("#scan-item-fs"), $("#item-confirmation-fs"));
}

function reviewBox() {
  let items = boxes[boxCount].items;
  let inner = $("<div></div>");
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    inner.append("<div>UPC: " + item.upc + "</div>");
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
