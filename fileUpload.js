// const viewerElement = document.getElementById("viewer")
const signatureDragBtn = document.getElementById("signatureDragBtn");
const initialsDragBtn = document.getElementById("initialsDragBtn");
const checkboxDragBtn = document.getElementById("checkboxDragBtn");
const radioDragBtn = document.getElementById("radioDragBtn");
const dateDragBtn = document.getElementById("dateDragBtn");
const stampDragBtn = document.getElementById("stamp");
const saveBtn = document.getElementById("save");
const lic = "DigitalTrust Technologies Pvt Ltd(digitaltrusttech.com):OEM:Digital Signature Services Portal::B+:AMS(20220630):5CA5A97D0477080A7360B13AC982736160617FD5F900ED4BF50419D44A60189E528AB6F5C7"
const downloadBtn = document.getElementById("download");
const fillData = document.getElementById("fill");
instance = "";
Blobdata = "";
WebViewer(
  {
    licenseKey:lic,
    path: "WebViewer/lib",
    initialDoc: "150kB.pdf",
    fullAPI: true,
  },
  document.getElementById("viewer")
).then((instance) => {
  const { docViewer, Annotations, CoreControls, iframeWindow, PDFNet, Tools } =
    instance;
  const annotManager = docViewer.getAnnotationManager();
  this.instance = instance;
  document.getElementById("file-picker").onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      instance.UI.loadDocument(file);
    }
  };
  instance.UI.disableElements(["toolbarGroup-Edit"]);
  let arr = [];
  docViewer.addEventListener("documentLoaded", () => {
    docViewer.getAnnotationsLoadedPromise().then(() => {
      // iterate over fields
      const fieldManager = annotManager.getFieldManager();
      fieldManager.forEachField((field) => {
        

        
        //   arr.push(field.tooltipName);
        

          if(field.tooltipName === "Name"){
           field.setValue("Random Guy")
          }else if(field.tooltipName === "Father"){
            field.setValue("Anurag")
          }else if(field.tooltipName === "Mother"){
            field.setValue("Miss")
          }else if(field.tooltipName === "Date"){
            field.setValue("18")
         }else if(field.tooltipName === "Novemeber"){
            field.setValue("Adarsh")
         }else if(field.tooltipName === "Year"){
            field.setValue("1998")
         }else if(field.tooltipName === "Place Of Birth"){
            field.setValue("Odisha")
         }else{
            field.setValue("NA")
         }

        // console.log(arr);
      });
    });
  });
});

const addField = async (type, point = {}, name = "", value = "", flag = {}) => {
  if (this.instance !== "") {
    const { docViewer, Annotations } = this.instance;
    const annotManager = docViewer.getAnnotationManager();
    const doc = docViewer.getDocument();
    const displayMode = docViewer.getDisplayModeManager().getDisplayMode();
    const page = displayMode.getSelectedPages(point, point);
    if (!!point.x && page.first == null) {
      return; //don't add field to an invalid page location
    }
    // const currentuser = JSON.parse(localStorage.getItem("user"));

    const page_idx =
      page.first !== null ? page.first : docViewer.getCurrentPage();
    const page_info = doc.getPageInfo(page_idx);
    const page_point = displayMode.windowToPage(point, page_idx);
    const zoom = docViewer.getZoom();

    const pageHeight = docViewer.getPageHeight(page_idx);
    const pageWidth = docViewer.getPageWidth(page_idx);
    localStorage.setItem("pageWidth", pageWidth);
    localStorage.setItem("pageHeight", pageHeight);
    var textAnnot = new Annotations.FreeTextAnnotation();
    // textAnnot.NoResize = true;
    textAnnot.PageNumber = page_idx;
    const rotation = docViewer.getCompleteRotation(page_idx) * 90;

    textAnnot.Rotation = rotation;
    if (rotation === 270 || rotation === 90) {
      textAnnot.Width = 20.0 / zoom;
      textAnnot.Height = 150.0 / zoom;
    } else {
      textAnnot.Width = 150.0 / zoom;
      textAnnot.Height = 20.0 / zoom;
    }
    ////////////////////////////
    const AnnotWidth = textAnnot.Width;
    const AnnotHeight = textAnnot.Height;
    // setAnnotHeight(AnnotHeight);
    annotAnnotHeight = AnnotHeight;
    // textAnnot.Width = 150.0 / zoom;
    // textAnnot.Height = 20.0 / zoom;
    textAnnot.X = (page_point.x || page_info.width / 2) - textAnnot.Width / 2;
    textAnnot.Y = (page_point.y || page_info.height / 2) - textAnnot.Height / 2;

    textAnnot.setPadding(new Annotations.Rect(0, 0, 0, 0));
    textAnnot.custom = {
      type,
      value,
      flag,
      name: `${type}_${"adarshsahu2510@gmail.com"}_`,
    };
    textAnnot.setCustomData("type", type);
    textAnnot.setCustomData("value", value);
    textAnnot.setCustomData("flag", flag);
    // textAnnot.setCustomData("name", name);
    // showSwal().then((res) => {
    //   // alert(res)
    //   textAnnot.setCustomData("name", res);
    // });
    textAnnot.setCustomData("recepient", "adarshsahu2510@gmail.com");
    // set the type of annot
    textAnnot.setContents(textAnnot.custom.name);
    textAnnot.FontSize = "" + 12.0 / zoom + "px";
    textAnnot.FillColor = new Annotations.Color(211, 211, 211, 0.5);
    textAnnot.TextColor = new Annotations.Color(0, 165, 228);
    textAnnot.StrokeThickness = 1;
    textAnnot.StrokeColor = new Annotations.Color(0, 165, 228);
    textAnnot.TextAlign = "center";

    textAnnot.Author = annotManager.getCurrentUser();

    annotManager.deselectAllAnnotations();
    annotManager.addAnnotation(textAnnot, true);
    annotManager.redrawAnnotation(textAnnot);
    annotManager.selectAnnotation(textAnnot);
    // annotManager.drawAnnotationsFromList(textAnnot)
  }
};

const fillFormData = () => {
  const { Annotations, docViewer, PDFNet, CoreControls } = instance;
  const annotManager = docViewer.getAnnotationManager();
  const fieldManager = annotManager.getFieldManager();
  const annotationsList = annotManager.getAnnotationsList();
};

const applyFields = async (action) => {
  const { Annotations, docViewer, PDFNet, CoreControls } = instance;
  const annotManager = docViewer.getAnnotationManager();
  const fieldManager = annotManager.getFieldManager();
  const annotationsList = annotManager.getAnnotationsList();
  const annotsToDelete = [];
  const annotsToDraw = [];
  const zoom = docViewer.getZoom();

  try {
    annotationsList.map(async (annot, index) => {
      let inputAnnot;
      let field;
      if (annot.getCustomData("type") !== "") {
        // create a form field based on the type of annotation
        if (
          annot.getCustomData("type") === "TEXT" ||
          annot.getCustomData("type") === "INITIAL" ||
          annot.getCustomData("type") === "COMPANY" ||
          annot.getCustomData("type") === "FULL_NAME" ||
          annot.getCustomData("type") === "JOB_TITLE" ||
          annot.getCustomData("type") === "ADDRESS" ||
          annot.getCustomData("type") === "PHONE"
        ) {
          const flags = new Annotations.WidgetFlags();
          flags.set("Required", true);
          flags.set("Edit", true);

          // set font type
          const font = new Annotations.Font({ name: "Helvetica" });
          field = new Annotations.Forms.Field(
            annot.getCustomData("name") + Date.now() + index,
            {
              type: "Tx",
              defaultValue: "Fill Data",
              value:
                annot.getCustomData("value") === ""
                  ? annot.getCustomData("name")
                  : annot.getCustomData("value"),
              tooltipName: annot.getCustomData("name"),
              flags,
              font: font,
            }
          );
          inputAnnot = new Annotations.TextWidgetAnnotation(field);
        } else if (annot.getCustomData("type") === "EMAIL") {
          field = new Annotations.Forms.Field(
            annot.getCustomData("name") + Date.now() + index,
            {
              type: "Tx",
              value: annot.getCustomData("value"),
            }
          );
          inputAnnot = new Annotations.TextWidgetAnnotation(field);
        } else if (annot.getCustomData("type") === "CHECKBOX") {
          const flags = new Annotations.WidgetFlags();
          flags.set("Required", true);
          flags.set("Edit", true);

          // set font type
          const font = new Annotations.Font({ name: "Helvetica" });

          // create a form field
          const field = new Annotations.Forms.Field(
            annot.getCustomData("type") + Date.now() + index,
            {
              type: "Btn",
              value: "Off",
              flags,
              font: font,
            }
          );

          // create a widget annotation
          const inputAnnot = new Annotations.CheckButtonWidgetAnnotation(
            field,
            {
              appearance: "Off",
              appearances: {
                Off: {},
                Yes: {},
              },
            }
          );

          // set position and size
          //   widgetAnnot.PageNumber = 1;
          //   widgetAnnot.X = 100;
          //   widgetAnnot.Y = 100;
          //   widgetAnnot.Width = 50;
          //   widgetAnnot.Height = 20;

          //add the form field and widget annotation
          //   annotManager.getFieldManager().addField(field);
          //   annotManager.addAnnotation(widgetAnnot);
          //   annotManager.drawAnnotationsFromList([widgetAnnot]);
        } else if (annot.getCustomData("type") === "SIGNATURE") {
          let recpemail = annot.getCustomData("recepient");
          let anname = annot.getCustomData("name") + Date.now() + index;
          signCordinates = {
            fieldName: anname,
            posX: annot.getX(),
            posY: annot.getY(),
            PageNumber: annot.getPageNumber(),
            width: annot.getWidth(),
            height: annot.getHeight(),
          };

          field = new Annotations.Forms.Field(
            annot.getCustomData("name") + Date.now() + index,
            {
              type: "Sig",
            }
          );
          inputAnnot = new Annotations.SignatureWidgetAnnotation(field, {
            appearance: "_DEFAULT",
            appearances: {
              _DEFAULT: {
                Normal: {
                  data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuMWMqnEsAAAANSURBVBhXY/j//z8DAAj8Av6IXwbgAAAAAElFTkSuQmCC",
                  offset: {
                    x: 100,
                    y: 100,
                  },
                },
              },
            },
          });
        } else if (annot.getCustomData("type") === "DATE") {
          field = new Annotations.Forms.Field(
            annot.getCustomData("name") + Date.now() + index,
            {
              type: "Tx",
              value: "m-d-yyyy",
              // Actions need to be added for DatePickerWidgetAnnotation to recognize this field.
              actions: {
                F: [
                  {
                    name: "JavaScript",
                    // You can customize the date format here between the two double-quotation marks
                    // or leave this blank to use the default format
                    javascript: 'AFDate_FormatEx("mmm d, yyyy");',
                  },
                ],
                K: [
                  {
                    name: "JavaScript",
                    // You can customize the date format here between the two double-quotation marks
                    // or leave this blank to use the default format
                    javascript: 'AFDate_FormatEx("mmm d, yyyy");',
                  },
                ],
              },
            }
          );

          inputAnnot = new Annotations.DatePickerWidgetAnnotation(field);
        } else {
          // exit early for other annotations
          annotManager.deleteAnnotation(annot, false, true); // prevent duplicates when importing xfdf
          return;
        }
      } else {
        // exit early for other annotations
        return;
      }

      // set position
      inputAnnot.PageNumber = annot.getPageNumber();

      inputAnnot.Y = annot.getY();
      inputAnnot.X = annot.getX();

      inputAnnot.rotation = annot.Rotation;
      if (annot.Rotation === 0 || annot.Rotation === 180) {
        inputAnnot.Width = annot.getWidth();
        inputAnnot.Height = annot.getHeight();
      } else {
        inputAnnot.Width = annot.getHeight();
        inputAnnot.Height = annot.getWidth();
      }

      // delete original annotation
      annotsToDelete.push(annot);

      // customize styles of the form field
      Annotations.WidgetAnnotation.getCustomStyles = function (widget) {
        if (widget instanceof Annotations.SignatureWidgetAnnotation) {
          return {
            border: "1px solid #a5c7ff",
            "background-color": "transparent",
            color: "white",
            "font-size": "12px",
            "font-family": "Comic Sans MS Bold Italic",
          };
        } else {
          return {
            border: "1px solid #000000",
            "font-size": 0,
          };
        }
      };
      Annotations.WidgetAnnotation.getCustomStyles(inputAnnot);

      inputAnnot.setCustomData("recepient", annot.getCustomData("recepient"));
      inputAnnot.setCustomData("field_type", annot.getCustomData("type"));
      if (annot.getCustomData("type") === "SIGNATURE") {
        inputAnnot.setCustomData("issigfield", true);
      } else {
        inputAnnot.setCustomData("issigfield", false);
      }

      //   if (annot.getCustomData("type") === "ESEAL") {
      //     inputAnnot.setCustomData("isesealField", true);
      //   } else {
      //     inputAnnot.setCustomData("isesealField", false);
      //   }

      //   if (
      //     annot.getCustomData("type") !== "SIGNATURE" &&
      //     annot.getCustomData("type") !== "ESEAL"
      //   ) {

      annotManager.addAnnotation(inputAnnot);

      fieldManager.addField(field);
      annotsToDraw.push(inputAnnot);
      //   }
    });
    //   );
    // inputAnnot.FontSize = "" + 1.0 / zoom + "px"
    //   setSignCords(signCordinates);
    //   setesealCords(esealCordinates);
    // delete old annotations
    annotManager.deleteAnnotations(annotsToDelete, null, true);

    // refresh viewer
    await annotManager.drawAnnotationsFromList(annotsToDraw);

    const xfdfString = await annotManager.exportAnnotations();
    const data = await docViewer.getDocument().getFileData({
      xfdfString,
      flags: CoreControls.SaveOptions.INCREMENTAL,
      downloadType: "pdf",
    });

    //certify pdf/a
    await PDFNet.initialize();
    const doc = await PDFNet.PDFDoc.createFromBuffer(new Uint8Array(data));

    await PDFNet.runWithCleanup(async () => {
      doc.lock();
      const buf = await doc.saveMemoryBuffer(
        PDFNet.SDFDoc.SaveOptions.e_incremental
      );
      const blob = new Blob([buf], { type: "application/pdf" });
      this.Blobdata = blob;
      // localStorage.setItem("FILEDATA",blob);
    });
  } catch (e) {
    console.log("response ===" + e.response);
    console.log("Message ===" + e.message);
    console.log(e);
  }
};

const download = () => {
  var url = window.URL || window.webkitURL;
  link = url.createObjectURL(this.Blobdata);
  var a = document.createElement("a");
  a.setAttribute("download", "template");
  a.setAttribute("href", link);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const showSwal = async () => {
  let name = "";
  return new Promise((resolve, reject) => {
    swal
      .fire({
        title: "Name the Field",
        text: "Annotate the Field",
        html: `<input type="text" id="fieldName" class="swal2-input" placeholder="FieldName">`,
        // type: "input",
        preConfirm: () => {
          const fieldName = Swal.getPopup().querySelector("#fieldName").value;
          return { fieldName: fieldName };
        },
        showCancelButton: true,
        closeOnConfirm: false,
        animation: "slide-from-top",
        confirmButtonText: "Add",
      })
      .then((result) => {
        name = result.value.fieldName;

        resolve(name);
      });
  });
  //    swal.fire({
  //         title: "Name the Field",
  //         text: "Annotate the Field",
  //         html: `<input type="text" id="fieldName" class="swal2-input" placeholder="FieldName">`,
  //         // type: "input",
  //         preConfirm: () => {
  //             const fieldName = Swal.getPopup().querySelector('#fieldName').value
  //             return {fieldName:fieldName};
  //         },
  //         showCancelButton: true,
  //         closeOnConfirm: false,
  //         animation: "slide-from-top",
  //         confirmButtonText: 'Add',
  //       })
  //       .then((result)=>{
  //         name=result.value.fieldName

  //         // return new Promise((resolve,reject)=>{resolve(name)})
  //       })
};
const dragStart = (e) => {
  e.target.style.opacity = 0.5;
  const copy = e.target.cloneNode(true);
  copy.id = "form-build-drag-image-copy";
  copy.style.width = "250px";
  document.body.appendChild(copy);
  e.dataTransfer.setDragImage(copy, 125, 25);
  e.dataTransfer.setData("text", "");
};

const dragEnd = (e, type) => {
  //   const recData = await showSwal();
  addField(type, dropPoint);
  e.target.style.opacity = 1;
  document.body.removeChild(
    document.getElementById("form-build-drag-image-copy")
  );

  e.preventDefault();
};

stampDragBtn.addEventListener("click", () => {
  addField("SIGNATURE");
});
signatureDragBtn.addEventListener("click", () => {
  addField("SIGNATURE");
});

saveBtn.addEventListener("click", () => {
  applyFields("save");
});
downloadBtn.addEventListener("click", download);
fillData.addEventListener("click", fillFormData);
