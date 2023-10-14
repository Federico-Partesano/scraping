"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = void 0;
const cheerio_1 = __importDefault(require("cheerio"));
const f = (htmlString, headers) => {
    const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/g;
    const tdMatches = htmlString.match(tdRegex);
    if (!tdMatches)
        return null;
    const t = tdMatches
        .map((match) => {
        let content = match
            .replace(/<\/?td[^>]*>/g, "")
            .replace(/<\/?strong[^>]*>/g, "")
            .replace(/<\/?span[^>]*>/g, "")
            .replace(/<\/?a[^>]*>/g, "")
            .replace(/<\/?b[^>]*>/g, "")
            .replace(/<\/?font[^>]*>/g, "")
            .replace(/\n/g, "");
        return content;
    })
        .splice(0, 10); // Ritorna solo i primi 10 risultati
    if (!headers)
        return t;
    let output = {};
    headers.forEach((header, index) => {
        output[header] = t[index];
    });
    return output;
};
const getUsers = (page) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`https://www.iqmselezione.it/admin/amministra.php?link=2&&page=${page}`, {
        headers: {
            accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7",
            "sec-ch-ua": '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "frame",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            cookie: "_ga=GA1.1.969013372.1680772973; _fbp=fb.1.1680772973189.962531141; roundcube_cookies=enabled; __utmz=221577344.1689582796.1.1.utmccn=(direct)|utmcsr=(direct)|utmcmd=(none); __utma=221577344.1958274846.1689582796.1689586163.1689590704.4; _gcl_au=1.1.1700558223.1689769890; _ga_KL0X5YGJ8M=GS1.1.1695376633.13.0.1695376635.0.0.0; PHPSESSID=i3o5ubhbi0npcmcsrv4ibo7qd4",
            Referer: "https://www.iqmselezione.it/admin/amministra.php?link=2",
            "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: null,
        method: "GET",
    });
    const $ = cheerio_1.default.load(yield response.text());
    const html = $.html();
    const ultimoTbody = $("tbody").last();
    const t = ultimoTbody.html();
    const tt = t.split("</tr>");
    const headers = f(tt[0]);
    // const datiFile = fs.readFileSync(path2, "utf-8");
    // const oggettoJson = JSON.parse(datiFile);
    // fs.writeFileSync(path, t);
    return tt.map((item) => f(item, headers));
});
exports.getUsers = getUsers;
