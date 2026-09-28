// ========================================
// GENERATE AI RESPONSE
// ========================================

async function generateResponse(feature) {

    const input =
        document.getElementById("userInput");

    const result =
        document.getElementById("result");

    const loading =
        document.getElementById("loading");

    const error =
        document.getElementById("error");

    const buttons =
        document.querySelectorAll(".buttons button");


    // Get user input

    const text =
        input.value.trim();


    // Clear previous error

    error.textContent = "";


    // Validate input

    if (!text) {

        error.textContent =
            "Please enter some notes or a question first.";

        return;

    }


    // ========================================
    // PROMPTS
    // ========================================

    let prompt = "";


    // SUMMARIZE

    if (feature === "summarize") {

        prompt = `

You are a helpful study assistant.

Summarize the following student notes.

Requirements:

- Identify the main concepts.
- Use simple language.
- Use bullet points where appropriate.
- Keep the summary concise.
- Do not add information that is not present in the notes.

Student notes:

${text}

`;

    }


    // QUIZ

    else if (feature === "quiz") {

        prompt = `

You are a helpful study assistant.

Create a short quiz from the following student notes.

Requirements:

- Create 5 questions.
- Include a mixture of multiple-choice
  and short-answer questions.
- Provide the correct answer after each question.
- Questions must be based only on the provided notes.

Student notes:

${text}

`;

    }


    // EXPLAIN

    else if (feature === "explain") {

        prompt = `

You are a helpful study assistant.

Explain the following topic to a college student.

Requirements:

- Use simple and clear language.
- Explain the important concepts step by step.
- Give a simple example when useful.
- Avoid unnecessary technical jargon.

Topic or question:

${text}

`;

    }


    // IMPROVE ANSWER

    else if (feature === "improve") {

        prompt = `

You are an academic writing assistant.

Improve the following student answer.

Requirements:

- Preserve the original meaning.
- Correct grammar and sentence structure.
- Make the answer clearer and more professional.
- Do not introduce unrelated information.
- After the improved answer,
  briefly list the major improvements.

Student answer:

${text}

`;

    }


    // ========================================
    // SHOW LOADING
    // ========================================

    loading.style.display = "block";

    result.textContent = "";


    // Disable AI buttons

    buttons.forEach(button => {

        button.disabled = true;

    });


    // ========================================
    // SEND REQUEST
    // ========================================

    try {

        const response =
            await fetch("/api/generate", {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    prompt: prompt

                })

            });


        const data =
            await response.json();


        // Check API response

        if (!response.ok) {

            throw new Error(
                data.error ||
                "Something went wrong."
            );

        }


        // Display AI result

        result.textContent =
            data.result;


    }


    // ========================================
    // ERROR HANDLING
    // ========================================

    catch (err) {

        error.textContent =
            err.message ||
            "Unable to generate response.";

    }


    // ========================================
    // FINALLY
    // ========================================

    finally {

        loading.style.display =
            "none";


        buttons.forEach(button => {

            button.disabled = false;

        });

    }

}


// ========================================
// CLEAR ALL
// ========================================

function clearAll() {

    const input =
        document.getElementById("userInput");

    const result =
        document.getElementById("result");

    const error =
        document.getElementById("error");

    const loading =
        document.getElementById("loading");


    // Clear input

    input.value = "";


    // Reset result

    result.textContent =
        "Your AI-generated response will appear here.";


    // Clear error

    error.textContent = "";


    // Hide loading

    loading.style.display =
        "none";

}


// ========================================
// COPY AI RESPONSE
// ========================================

async function copyResponse() {

    const result =
        document.getElementById("result");


    const responseText =
        result.textContent.trim();


    // Check whether response exists

    if (
        !responseText ||
        responseText ===
        "Your AI-generated response will appear here."
    ) {

        alert(
            "There is no AI response to copy."
        );

        return;

    }


    // Copy response

    try {

        await navigator.clipboard.writeText(
            responseText
        );


        alert(
            "AI response copied successfully!"
        );

    }


    catch (error) {

        alert(
            "Unable to copy the response."
        );

    }

}