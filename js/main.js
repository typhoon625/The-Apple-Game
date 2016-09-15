var apple_object;
var title = $("#apple_header")[0];
var selectImage = $("#select_file");
var anotherImage = $("#anotherImage");
var comments = $("#instructions")[0];
selectImage.on("change", function () {
    comments.innerHTML = "Analysing the image...";
    processImage(function (file) {
        sendImageRequest(file, function (info) {
            apple_object = getDescription(info);
            changeUI();
        });
    });
});
anotherImage.on("click", function () {
    swal("You clicked me!");
});
function processImage(callback) {
    var file = selectImage.get(0).files[0];
    var reader = new FileReader();
    if (file) {
        reader.readAsDataURL(file);
    }
    else {
        console.log("Invalid file");
    }
    reader.onloadend = function () {
        if (!file.name.match(/\.(jpg|jpeg|png)$/)) {
            comments.innerHTML = "You may only upload an image file that is in jpg, jpeg or png format.";
        }
        else {
            callback(file);
        }
    };
}
;
function changeUI() {
    comments.innerHTML = "The image you have presented to us is in fact " + apple_object.name;
}
function sendImageRequest(file, callback) {
    $.ajax({
        url: "https://api.projectoxford.ai/vision/v1.0/describe",
        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "79dc80fa2d414423895a954b99e7414d");
        },
        type: "POST",
        data: file,
        processData: false
    })
        .done(function (data) {
        if (data.length != 0) {
            var description = data.description;
            callback(description);
        }
        else {
            comments.innerHTML = "We can't see a photo at all!! Maybe an error? Try with another photo!!";
        }
    })
        .fail(function (error) {
        comments.innerHTML = "Sorry there is something wrong with the server... Try again later!!";
        console.log(error.getAllResponseHeaders());
    });
}
var Description = (function () {
    function Description(apple_color) {
        this.apple_color = apple_color;
        this.name = apple_color;
    }
    return Description;
}());
var red_apple = new Description("red apple(s). Looks very reddy!!");
var green_apple = new Description("green apple(s). Looks very greenilicious!!");
var yellow_apple = new Description("yellow apple(s). Looks so yellowful!!");
var not_apple = new Description("either not an apple or it is a really weirdly coloured apple I've never seen before!!");
function getDescription(description) {
    if (description.captions[0].text == "a red apple" && description.captions[0].confidence > 0.5) {
        apple_object = red_apple;
    }
    else if (description.captions[0].text == "a green apple" && description.captions[0].confidence > 0.5) {
        apple_object = green_apple;
    }
    else if (description.captions[0].text == "a yellow apple" && description.captions[0].confidence > 0.5) {
        apple_object = yellow_apple;
    }
    else {
        apple_object = not_apple;
    }
    return apple_object;
}
