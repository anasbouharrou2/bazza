import express from "express";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

// console.log(process.env.OPENAI_KEY);
function generate_prompt(question){
  return `Q: calcule moi la derivé de f(x)=x²+x
  A:f'(x) = 2x+1
  
  Q: calcule moi la derivé de f(x) = (4ln(x)/x²)-1/2
  A:f'(x) = (-8ln(x)/x³)-2/x²
  Q:calcule moi limite de f(x)=ln(x) quand x tend vers plus infinie 
  A:limite de f(x) quand x tend vers plus infinie est plus infinie
  
  Q: calcule moi limite de f(x)=ln(x) quand x tend vers moins l'infinie
  A:limite de f(x) quand x tend vers plus infinie est 0
  
  Q: comment montrer que x-arctan(x)>0 pour x>0
  A:on pose f(x)=x-arctan(x) et on fais 'étude de la fonction et on la trouve strictement positive , on on f'(x) = 1-1/(1+x²) qui est strictement positive pour x>0.
  d'ou f est strictement croissante
  
  Q:comment montrer que x-(x²/2) <= ln(1+x) pour x>0
  A: On pose f(x)=x-(x²/2)-ln(1+x) et on fais l'étude de la fonction et on trouve que f(0)=0 et f'(x)=1-1/(1+x) qui est strictement positive pour x>0. Donc f est strictement croissante et f(0)=0 donc f(x)>0 pour x>0.
  
  Q:comment (1/(1+x))-1+x<x² pour x>0
  A:On pose f(x)=(1/(1+x))-1+x-x² et on fais l'étude de la fonction et on trouve que f(0)=0 et f'(x)=-2x/(1+x)² qui est strictement négative pour x>0. Donc f est strictement décroissante et f(0)=0 donc f(x)<0 pour x>0.

  Q: ${question}
  `
}

const app = express();

app.use(cors());

app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const question = req.body.question;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generate_prompt(question),
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });
    // console.log(response);
    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    // console.error(error);
    res.status(500).send(error || "Something went wrong");
  }
});

app.listen(8000, () => {
  console.log("App is running");
});
