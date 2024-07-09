Dropzone.autoDiscover = false;

function init() {
    let dz = new Dropzone("#dropzone", {
        url: "/",
        maxFiles: 1,
        addRemoveLinks: true,
        dictDefaultMessage: "Some Message",
        autoProcessQueue: false
    });
    
    dz.on("addedfile", function() {
        if (dz.files[1]!=null) {
            dz.removeFile(dz.files[0]);        
        }
    });

    dz.on("complete", function (file) {
        let imageData = file.dataURL;
        
        let url = "http:"

        $.post(url, {
            image_data: file.dataURL
        },function(data, status) {
            
            console.log(data);
            if (!data || data.length==0) {
                document.getElementById("resultHolder").style.display = "none";
                document.getElementById("divClassTable").style.display = "none";                
                document.getElementById("error").style.display = "";
                return;
            }
            let players = ["lionel_messi", "maria_sharapova", "roger_federer", "serena_williams", "virat_kohli"];
            
            let match = null;
            let bestScore = -1;
            for (let i=0;i<data.length;++i) {
                let maxScoreForThisClass = Math.max(...data[i].class_probability);
                if(maxScoreForThisClass>bestScore) {
                    match = data[i];
                    bestScore = maxScoreForThisClass;
                }
            }
            if (match) {
                document.getElementById("error").style.display = "none";
                document.getElementById("resultHolder").style.display = "";
                document.getElementById("divClassTable").style.display = "";
                document.getElementById("resultHolder").innerHTML = $(`[data-player="${match.class}"`.innerHTML);
                let classDictionary = match.class_dictionary;
                for(let personName in classDictionary) {
                    let index = classDictionary[personName];
                    let proabilityScore = match.class_probability[index];
                    let elementName = "#score_" + personName;
                    elementName.innerHTML = proabilityScore;
                }
            }
            
        });
    });

    document.getElementById("submitBtn").addEventListener('click', (e) => {
        dz.processQueue();		
    });
}

document.ready(function() {
    console.log( "ready!" );
    document.getElementById("error").style.display = "none";
    document.getElementById("resultHolder").style.display = "none";
    document.getElementById("divClassTable").style.display = "none";

    init();
});