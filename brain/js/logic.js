document.addEventListener("DOMContentLoaded", function(e) {

    let quizIndex = {};
    let QuizArray = [];
    let QuizAns = {};
    let name = 'JavaScript';
    let category = 'code';
    let limit = 10;
    let startIndex = 0;
    let index = 0;
    const Apikey = 'Ol8s0X2iWFe8w6p1L7Nckl9qM99YVH1mab9gjH3E';

    fetch('https://quizapi.io/api/v1/questions?apiKey=' + Apikey + '&category=' + category + '&limit=' + limit + '&tags=' + name)
        .then(response => response.json())
        .then(data => {
            quizIndex = new QuizQuestion(data).main_dict;
            QuizArray = Object.keys(quizIndex);

            QuizAns = {};
            result = false;
            let tr = document.getElementById("quiz-header")
            tr.innerHTML = name + " MCQ";

            let title = document.getElementById("title")
            title.innerHTML = name + " MCQ";

            GetQuestion(GetKey(startIndex, true));
            document.getElementById("next-btn").disabled = true;
            document.getElementById("previous-btn").disabled = true;

        });

    document.getElementById("restart").addEventListener("click", function() {
        GetQuestion(GetKey(startIndex, true));
        document.getElementById("next-btn").disabled = true;
        document.getElementById("previous-btn").disabled = true;
    });
    document.getElementById("previous-btn").addEventListener("click", function() {
        GetQuestion(GetKey(startIndex, false));
        console.log(index);
        if (index == 0)
            document.getElementById("previous-btn").disabled = true;
    });

    document.getElementById("next-btn").addEventListener("click", function() {
        GetQuestion(GetKey(startIndex, true));
        // console.log(startIndex);
        document.getElementById("next-btn").disabled = true;
        if (index > 0)
            document.getElementById("previous-btn").disabled = false;
        console.log(index + "" + limit);
        if (index == limit) {

            var arr = Object.values(QuizAns);
            var correct = arr.filter(function(el) {
                return el != false;
            });
            var res = (arr.length / 2) + (arr.length / 4);
            document.getElementById("icon").innerHTML = correct.length >= res.length ? "&#xe876;" : "&#xE5CD;";
            document.getElementById("res").innerHTML = "Your Score " + correct.length + "/" + arr.length;
            document.getElementById("msg").innerHTML = correct.length >= res.length ? "Well Done. You are a Winner Thanks for good Attempt." : "OOPS! Please Try Again and get a better score";
            $("#myModal").modal();
        }
    });

    function GetKey(currentItem, isNext) {
        const currentIndex = QuizArray.indexOf(currentItem);
        let nextIndex = (isNext ? currentIndex + 1 : currentIndex - 1); // % QuizArray.length;

        let tr = document.getElementById("count")
        tr.innerHTML = nextIndex + 1 + " of " + QuizArray.length;
        startIndex = QuizArray[nextIndex];
        index = nextIndex;
        return startIndex;
    }

    function GetQuestion(key) {
        let options = document.getElementById("quiz-set")
        var arr = []
        try {
            arr = Object.values(quizIndex[key].answers);
        } catch (error) {

        }

        if (arr.length > 0) {
            options.innerHTML = "";
            var question = "<div class='d-flex flex-row align-items-center question-title'><h3 class='text-danger'>Q.</h3><h5 class='mt-1 ml-2'>" + quizIndex[key].question + "</h5></div>";
            var filtered = arr.filter(function(el) {
                return el != null;
            });
            var longest = filtered.sort(function(a, b) { return b.length - a.length; })[0];
            // longest = longest.replace("<", "&lt;").replace(">", "&gt;");
            longest = longest.length;
            options.innerHTML = question;
            for (var ansid in quizIndex[key].answers) {
                var opt = quizIndex[key].answers[ansid];
                if (opt != null) {
                    // opt = opt.replace("<", "&lt;").replace(">", "&gt;");
                    // console.log(opt);
                    // console.log(opt.padEnd(longest) + ";")
                    options.innerHTML += ("<div class='ans ml-6' id= " + ansid + 'class' + "><label class='radio' id= " + ansid + 'label' + "><input type='radio' name=" + ansid + " value=" + ansid + " id=" + ansid + " onClick='clickFunc(this.value)''><span id= " + ansid + 'span' + "><xmp>" + opt.padEnd(longest) + "</xmp></span></label></div>");
                }
            }
            var buttons = document.querySelectorAll('input');

            for (var i = 0; i < buttons.length; ++i) {
                buttons[i].addEventListener('click', clickFunc);
            }
        }
    }

    function clickFunc(clicked_value) {
        var correctAns = quizIndex[startIndex].correct_answer;
        // console.log(clicked_value.srcElement.value + "  " + correctAns);
        var span = document.getElementById(clicked_value.srcElement.value + "span");
        var label = document.getElementById(clicked_value.srcElement.value + "label");
        var input = document.getElementById(clicked_value.srcElement.value);
        var div = document.getElementById(clicked_value.srcElement.value + "div");

        const result = clicked_value.srcElement.value == correctAns;
        if (result) {
            console.log("whooha!!!");
            input.style.borderColor = 'lightgreen';
            input.style.backgroundColor = 'lightgreen';
            input.style.color = '#fff';
            span.style.borderColor = 'lightgreen';
            span.style.backgroundColor = 'lightgreen';
            span.style.color = '#000';
            // div.style.borderColor = 'lightgreen';
            // div.style.backgroundColor = 'lightgreen';
            // div.style.color = '#fff';
            label.style.borderColor = 'lightgreen';
            label.style.backgroundColor = 'lightgreen';
            label.style.color = '#fff';
        } else {
            console.log("lol");
            input.style.borderColor = 'red';
            input.style.backgroundColor = 'red';
            input.style.color = '#fff';
            span.style.borderColor = 'red';
            span.style.backgroundColor = 'red';
            span.style.color = '#fff';
            // div.style.borderColor = 'red';
            // div.style.backgroundColor = 'red';
            // div.style.color = '#fff';
            label.style.borderColor = 'red';
            label.style.backgroundColor = 'red';
            label.style.color = '#fff';
        }

        //saving result
        QuizAns[startIndex] = result;
        var buttons = document.querySelectorAll('input');

        var arr = Object.keys(quizIndex[startIndex].answers);
        var filtered = arr.filter(function(el) {
            return el != null;
        });

        for (var i = 0; i < buttons.length; ++i) {
            console.log(filtered[i]);
            document.getElementById(filtered[i]).disabled = true;
        }

        document.getElementById("next-btn").disabled = false;
    }

    class QuizQuestion {
        constructor(data) {
            this.main_dict = {};

            //pushing from API ino specific arrays
            for (let i = 0; i < 10; i++) {
                this.question = "";
                this.answer_arr = [];
                this.correct_answers = "";
                this.current_question = 0;
                this.id = data[i].id;
                this.question = data[i].question;
                this.answer_arr.push(data[i].answers);
                this.correct_answers = data[i].correct_answers;
                this.main_dict[this.id] = {

                    "id": data[i].id,
                    "question": data[i].question,
                    "answers": data[i].answers,
                    "correct_answers": data[i].correct_answers,
                    "correct_answer": data[i].correct_answer,
                    "multiple_correct_answers": data[i].multiple_correct_answers == "true" ? true : false,

                }

            }
            console.log(Object.keys(this.main_dict));
        }


        /* printQuestion(){
         let question=document.createElement("p");
        let div=document.getElementById("div");
        question.textContent=this.question_arr[this.current_question];
        let ans=document.createElement("p");
        let answers=[this.answers_arr[this.current_question++].answer_a,
        this.answer_arr[this.current_question++].answer_b,
        this.answer_arr[this.current_question++].answer_c,
        this.answer_arr[this.current_question++].answer_d,
        this.answer_arr[this.current_question++].answer_e,
        this.answer_arr[this.current_question++].answer_f];
        console.log(answers);
    
        let correct_answer_arr=[this.correct_answer[this.current_question+1].answer_a_correct,
            correct_answer_arr=this.correct_answer[this.current_question+1].answer_b_correct,
            correct_answer_arr=this.correct_answer[this.current_question+1].answer_c_correct,
            correct_answer_arr=this.correct_answer[this.current_question+1].answer_d_correct,
            correct_answer_arr=this.correct_answer[this.current_question+1].answer_e_correct,
            correct_answer_arr=this.correct_answer[this.current_question+1].answer_f_correct];
    
        console.log("hello");
    
    }
    
 
     */


    }
}); // end of DOM event