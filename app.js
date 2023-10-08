//document.body.onload = addElement;

function import_graphml_file() {
    let input = document.createElement('input');
    const new_div = document.createElement("div");
    

    input.type = 'file';
    input.onchange = _ => {
      // you can use this method to get file and perform respective operations
              let files =   Array.from(input.files);
              console.log(files);
              console.log(files[0].type);
              const load_confirmation = document.createTextNode("Load File: " + files[0].name);
              new_div.appendChild(load_confirmation);
              //const current_div = document.getElementById("div1");
              document.body.appendChild(new_div)
              load_txt_file(files[0])
          };
    input.click();

    
}


function load_txt_file(file) {

    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function() {
        console.log(reader.result);
    };
    
    reader.onerror = function() {
        console.log(reader.error);
    };       
}
/*
function load_button(){
    alert("This is supposed to load a file")
} 
*/
