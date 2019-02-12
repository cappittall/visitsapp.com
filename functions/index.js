const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
/// Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const nodemailer = require('nodemailer');

const admin = require('firebase-admin');
admin.initializeApp();

// ***************************** This part for local or system  *******************
//*********************************************************************************


/*var serviceAccount = require("../build/jobijoy-c88b9-firebase-adminsdk-9fnzd-310260a0c4.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://jobijoy-c88b9.firebaseio.com"
});*/

//*******************************

//TODO: Check up 
const gmailEmail = encodeURIComponent('visitsapp.com@gmail.com'); // functions.config().gmail.email
const gmailPassword = encodeURIComponent('Aura533422'); //functions.config().gmail.password
const mailTransport = nodemailer.createTransport(
    `smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);
const APP_NAME = 'VisitsApp';





const dB = admin.database();

// Set users in advance upon a user signed in 
/*
exports.welcomeNewUser = functions.auth.user().onCreate(event => {
    const user = event.data;
    const ref = dB.ref('users/' + user.uid);
	   ref.child('name').set(user.displayName);
	   ref.child('photo').set(user.photoURL);
	   ref.child('tel').set(user.phoneNumber);
	   ref.child('email').set(user.email);
    return ref.child('registerDate').set((new Date()).getTime());
});
*/
exports.sendMeetDetMail = functions.database.ref('/meetings/{keyOrg}/{newKey}')
 .onCreate((snap, context)=>{
      const newMeet = snap.val(); // This is OK. new wecord 
      const email = newMeet.meetMail; // user who visited's own email
      const lang = newMeet.lang||"en";
      const lng = getUserLanguage(lang);
      const link = 'https://web.visitsapp.com/reports?key=' + newMeet.companyKey + '@'+ newMeet.orgKey +'&id=' +  encodeURIComponent(newMeet.company) + '&ef=true';
      const time = newMeet.start;
      if (email && newMeet.sendMail){   // Asuming emails length is more than 3 
         const mailOptions = {
           from: `${APP_NAME} <noreply@visitsapp.com>`,
           to: email,
           replyTo: newMeet.replyTo
         };


         // Just for English
          mailOptions.subject = lng.MessageSubject;
          mailOptions.html = lng.Dear +" "+ newMeet.name + ' !' + '<br /><br />'+ lng.Headline +'<br /> <br />'+ newMeet.notesCustomer + '<br /><br />' + time + '<br/><br/>'+  newMeet.staffName + ' <br /> ' + newMeet.orgName + '<br>' + newMeet.replyPhone + '<br /> <br /> <a href="' + link + '">'+ lng.ForAll + '</a><br /> <br /> ' + '<hr/><span>By <b>VisitsApp</b></span> <a href="visitsapp.com"><img style="width:80px" src="https://firebasestorage.googleapis.com/v0/b/visitapp-7ac36.appspot.com/o/logo192x192.png?alt=media&token=02906f50-9a94-4a8a-9ed5-dbf9be0519a6"></a><b style="padding-left:20px;">"Verba Volant, Scripta Manent !"</b> <br /> <img src="https://www.google-analytics.com/collect?v=1&tid=UA-119175896-1&cid='+ email +' &t=event&ec=email&ea=open&el='+ email +'&cs=Mailno6&cm=email&cn=DISEGACARRIER" />'; 
     
          mailTransport.sendMail(mailOptions).then(()=> {
             return console.log('EMail send:', email);
          }).catch((error)=> {
             console.error('Error oldu:', email, error);  
          });
      
          setTimeout(()=>{
               // Send email to my own email give a time a while
               console.log("reply to ", newMeet.replyTo );
               // Add private notes to my own mail
               mailOptions.to = "jobijoy@jobijoy.com";
           
            mailOptions.html = lng.Dear +" "+ newMeet.name + ' !' + '<br /><br />'+ lng.Headline +'<br /> <br />'+  newMeet.notesCustomer + '<br /><br />**' + newMeet.notesPrivate  + '<br /><br />' + time + '<br/><br/>'+ newMeet.staffName + ' <br /> ' + newMeet.orgName + '<br>' + newMeet.replyPhone + '<br /> <br /> <a href="' + link + '">'+ lng.ForAll + '</a><br /> <br /> ' + '<hr/><span>By <b>VisitsApp</b></span> <a href="visitsapp.com"><img style="width:80px" src="https://firebasestorage.googleapis.com/v0/b/visitapp-7ac36.appspot.com/o/logo192x192.png?alt=media&token=02906f50-9a94-4a8a-9ed5-dbf9be0519a6"></a><b style="padding-left:20px;">"Verba Volant, Scripta Manent !"</b> <br /> <img src="https://www.google-analytics.com/collect?v=1&tid=UA-119175896-1&cid='+ email +' &t=event&ec=email&ea=open&el='+ email +'&cs=Mailno6&cm=email&cn=DISEGACARRIER" />'; 
           
           
           
          
               mailTransport.sendMail(mailOptions).then(()=> {
                  return console.log('EMail send kendime:');
               }).catch(error=>{
                  console.error('Error oldu:', email, error);  
               });
          },900)
    }
    
 return snap.ref.child('sentMail').set('Ok')
});


// Language section
function calculateDate(date, lang) {
     let d = new Date(date);
      var options = {
         weekday: "short",
         year: "numeric",
         month: "2-digit",
         day: "numeric",
         hour:"numeric",
         minute:"2-digit"
      };
      return d.toLocaleDateString(lang, options);
}



function getUserLanguage(lang){
    // Here Language 
    const language = {		
     "az":				
 {	"MessageSubject"	:	"Son görüş ətraflı"	
,	"Dear"	:	"Əziz"	
,	"Headline"	:	"görüş üçün çox təşəkkür edirik, görüş qeydləri aşağıda tapa bilərsiniz."	
,	"ForAll"	:	"Bizim şirkət arasında bütün qeydlər üçün."	},
"id":				
 {	"MessageSubject"	:	"rincian pertemuan terakhir"	
,	"Dear"	:	"sayang"	
,	"Headline"	:	"Terima kasih banyak untuk pertemuan, silakan menemukan di bawah catatan rapat."	
,	"ForAll"	:	"Untuk semua catatan antara perusahaan kami."	},
"ms":				
 {	"MessageSubject"	:	"butiran pertemuan terakhir"	
,	"Dear"	:	"Dear"	
,	"Headline"	:	"Terima kasih banyak untuk mesyuarat itu, sila lihat di bawah nota mesyuarat."	
,	"ForAll"	:	"Untuk semua nota antara syarikat kami."	},
"ca":				
 {	"MessageSubject"	:	"Detalls última reunió"	
,	"Dear"	:	"volgut"	
,	"Headline"	:	"Moltes gràcies per la reunió, s'adjunta a continuació les notes de la reunió."	
,	"ForAll"	:	"Per a totes les notes entre la nostra empresa."	},
"cs":				
 {	"MessageSubject"	:	"Podrobnosti poslední schůzi"	
,	"Dear"	:	"Milý"	
,	"Headline"	:	"Děkuji moc za schůzi, naleznete níže poznámek ke konferenci."	
,	"ForAll"	:	"Pro všechny poznámky mezi naší společnosti."	},
"da":				
 {	"MessageSubject"	:	"Sidste mødedetaljer"	
,	"Dear"	:	"Kære"	
,	"Headline"	:	"Mange tak for mødet, Nedenstående mødereferaterne."	
,	"ForAll"	:	"For alle noter mellem vores virksomhed."	},
"de":				
 {	"MessageSubject"	:	"Letzte Sitzung Details"	
,	"Dear"	:	"sehr geehrter"	
,	"Headline"	:	"Vielen Dank für das Treffen, finden Sie bitte unter den Meeting-Notizen."	
,	"ForAll"	:	"Für alle Noten zwischen unserem Unternehmen."	},
"et":				
 {	"MessageSubject"	:	"Viimase kohtumise üksikasjad"	
,	"Dear"	:	"kallis"	
,	"Headline"	:	"Tänan teid väga koosolekul, siis leia alla koosoleku märkmed."	
,	"ForAll"	:	"Kõigi märkmete meie firma."	},
"en":	 	 	 	
 {	"MessageSubject"	:	"Last meeting details"	
,	"Dear"	:	"Dear"	
,	"Headline"	:	"Thank you very much for the meeting, please find below  the meeting notes."	
,	"ForAll"	:	"For all notes between our company."	},
"es":				
{	"MessageSubject"	:	"Detalles última reunión"	
,	"Dear"	:	"querido"	
,	"Headline"	:	"Muchas gracias para la reunión, se adjunta a continuación las notas de la reunión."	
,	"ForAll"	:	"Para todas las notas entre nuestra empresa."	},
"fr":				
{	"MessageSubject"	:	"détails de dernière réunion"	
,	"Dear"	:	"cher"	
,	"Headline"	:	"Merci beaucoup pour la réunion, s'il vous plaît trouverez ci-dessous les notes de réunion."	
,	"ForAll"	:	"Pour toutes les notes entre notre société."	},
"hr":				
 {	"MessageSubject"	:	"Detalji posljednji sastanak"	
,	"Dear"	:	"draga"	
,	"Headline"	:	"Hvala vam vrlo mnogo za sastanak, molimo naći ispod bilješke sa sastanka."	
,	"ForAll"	:	"Za sve bilješke između naše tvrtke."	},
"it":				
{	"MessageSubject"	:	"dettagli ultimo incontro"	
,	"Dear"	:	"caro"	
,	"Headline"	:	"La ringrazio molto per la riunione, si prega di trovare sotto le note di riunione."	
,	"ForAll"	:	"Per tutte le note tra la nostra azienda."	},
"sw":				
{	"MessageSubject"	:	"maelezo ya mkutano wa mwisho"	
,	"Dear"	:	"Ndugu"	
,	"Headline"	:	"Asante sana kwa ajili ya mkutano, tafadhali kupata chini ya maelezo ya mkutano."	
,	"ForAll"	:	"Kwa maelezo yote kati ya kampuni yetu."	},
"lv":				
{	"MessageSubject"	:	"Pēdējā tikšanās detaļas"	
,	"Dear"	:	"dārgs"	
,	"Headline"	:	"Liels paldies par tikšanos, lūdzu, atrast zem sapulces piezīmes."	
,	"ForAll"	:	"Visiem piezīmēm starp mūsu kompāniju."	},
"lt":				
{	"MessageSubject"	:	"Paskutiniame posėdyje detalės"	
,	"Dear"	:	"brangusis"	
,	"Headline"	:	"Labai ačiū už susitikimą, rasite žemiau susitikimų pastabas."	
,	"ForAll"	:	"Visiems notomis tarp mūsų įmonę."	},
"hu":				
{	"MessageSubject"	:	"Az utolsó találkozó részletei"	
,	"Dear"	:	"kedves"	
,	"Headline"	:	"Köszönöm szépen az ülésen, kérem találja a találkozó jegyzeteket."	
,	"ForAll"	:	"Minden megjegyzések között cégünk."	},
"nl":				
{	"MessageSubject"	:	"Laatste vergaderingsdetails"	
,	"Dear"	:	"Geachte"	
,	"Headline"	:	"Hartelijk dank voor de vergadering, vindt u hieronder de vergadering notities."	
,	"ForAll"	:	"Voor alle noten tussen ons bedrijf."	},
"nb":				
{	"MessageSubject"	:	"Siste møtedetaljene"	
,	"Dear"	:	"Kjære"	
,	"Headline"	:	"Tusen takk for møtet, kan du finne under møtenotater."	
,	"ForAll"	:	"For alle notater mellom vårt selskap."	},
"uz":				
{	"MessageSubject"	:	"Oxirgi uchrashuv tafsilotlari"	
,	"Dear"	:	"Hurmatli"	
,	"Headline"	:	"uchrashuv uchun katta rahmat, uchrashuv yozuvlari quyida topishingiz mumkin."	
,	"ForAll"	:	"Bizning kompaniya o'rtasidagi barcha yozuvlari uchun."	},
"fil":				
{	"MessageSubject"	:	"mga detalye Huling pulong"	
,	"Dear"	:	"mahal"	
,	"Headline"	:	"Maraming salamat sa inyo para sa mga pulong, pakihanap sa ibaba ang mga tala ng pagpupulong."	
,	"ForAll"	:	"Para sa lahat ng mga tala sa pagitan ng aming kumpanya."	},
"pl":				
{	"MessageSubject"	:	"szczegóły ostatniego posiedzenia"	
,	"Dear"	:	"Drogi"	
,	"Headline"	:	"Dziękuję bardzo za spotkanie, proszę znaleźć poniżej notach konferencyjnych."	
,	"ForAll"	:	"Dla wszystkich notatek pomiędzy naszą firmą."	},
"pt_br":				
{	"MessageSubject"	:	"detalhes última reunião"	
,	"Dear"	:	"caro"	
,	"Headline"	:	"Muito obrigado para a reunião, por favor, encontre abaixo das notas da reunião."	
,	"ForAll"	:	"Para todas as notas entre nossa empresa."	},
"pt_pt":				
{	"MessageSubject"	:	"detalhes última reunião"	
,	"Dear"	:	"caro"	
,	"Headline"	:	"Muito obrigado para a reunião, por favor, encontre abaixo das notas da reunião."	
,	"ForAll"	:	"Para todas as notas entre nossa empresa."	},
"ro":				
{	"MessageSubject"	:	"Detalii Ultima întâlnire"	
,	"Dear"	:	"dragă"	
,	"Headline"	:	"Vă mulțumesc foarte mult pentru întâlnire, vă rugăm să găsiți mai jos notele de ședință."	
,	"ForAll"	:	"Pentru toate notele între compania noastră."	},
"sq":				
{	"MessageSubject"	:	"Detajet e takimit të fundit"	
,	"Dear"	:	"i dashur"	
,	"Headline"	:	"Ju faleminderit shumë për takimin, ju lutem gjeni më poshtë shënimet e takimit."	
,	"ForAll"	:	"Për të gjitha shënimet në mes të kompanisë sonë."	},
"sk":				
{	"MessageSubject"	:	"Podrobnosti poslednej schôdzi"	
,	"Dear"	:	"drahá"	
,	"Headline"	:	"Ďakujem moc za schôdzu, nájdete nižšie poznámok ku konferencii."	
,	"ForAll"	:	"Pre všetky poznámky medzi našej spoločnosti."	},
"sl":				
{	"MessageSubject"	:	"Podrobnosti o zadnji seji"	
,	"Dear"	:	"dragi"	
,	"Headline"	:	"Najlepša hvala za srečanja, vam v nadaljevanju pojasnil srečanja."	
,	"ForAll"	:	"Za vse not med našem podjetju."	},
"fi":				
{	"MessageSubject"	:	"Viimeksi mainitussa kokouksessa tiedot"	
,	"Dear"	:	"Rakas"	
,	"Headline"	:	"Paljon kiitoksia kokoukseen, Alla kokouksen muistiinpanoja."	
,	"ForAll"	:	"Kaikkien muistiinpanot yhtiömme."	},
"sv":				
{	"MessageSubject"	:	"Senaste mötes detaljer"	
,	"Dear"	:	"Kära"	
,	"Headline"	:	"Tack så mycket för mötet, Nedan mötesanteckningar."	
,	"ForAll"	:	"För alla anteckningar mellan vårt företag."	},
"vi":				
{	"MessageSubject"	:	"chi tiết cuộc họp cuối cùng"	
,	"Dear"	:	"kính thưa"	
,	"Headline"	:	"Cảm ơn bạn rất nhiều vì buổi làm việc, xin vui lòng tìm thấy bên dưới các biên bản họp."	
,	"ForAll"	:	"Đối với tất cả ghi chú giữa công ty chúng tôi."	},
"tr":				
{	"MessageSubject"	:	"Son görüşme/toplantı hk."	
,	"Dear"	:	"Sayın"	
,	"Headline"	:	"Görüşme/Tel görüşmesi için çok teşekkür ederim, toplantı notlarını aşağıda bulabilirsiniz."	
,	"ForAll"	:	"Önceki tüm notlar için."	},
"el":				
{	"MessageSubject"	:	"λεπτομέρειες τελευταία συνάντηση"	
,	"Dear"	:	"αγαπητός"	
,	"Headline"	:	"Σας ευχαριστώ πολύ για τη συνάντηση, παρακαλούμε να βρείτε κάτω από τα πρακτικά των συναντήσεων."	
,	"ForAll"	:	"Για όλες τις σημειώσεις μεταξύ της εταιρείας μας."	},
"bg":				
{	"MessageSubject"	:	"Последна среща детайли"	
,	"Dear"	:	"скъп"	
,	"Headline"	:	"Благодаря ви много за срещата, моля вижте по-долу бележки на срещата."	
,	"ForAll"	:	"За всички бележки между нашата компания."	},
"kk":				
{	"MessageSubject"	:	"Өткен кездесу толығырақ"	
,	"Dear"	:	"Құрметті"	
,	"Headline"	:	"кездесу үшін үлкен рахмет, кездесу ноталары назарыңызға."	
,	"ForAll"	:	"Біздің компанияның арасындағы барлық жазбалар үшін."	},
"mk":				
{	"MessageSubject"	:	"Последната средба детали"	
,	"Dear"	:	"мил"	
,	"Headline"	:	"Ви благодарам многу за средбата, Ве молиме да ги најдете подолу забелешките во записникот."	
,	"ForAll"	:	"За сите белешки помеѓу нашата компанија."	},
"ru":				
{	"MessageSubject"	:	"подробнее Последняя встреча"	
,	"Dear"	:	"Уважаемые"	
,	"Headline"	:	"Большое спасибо за встречу, пожалуйста, найти ниже примечаний к собранию."	
,	"ForAll"	:	"Для всех нот между нашей компанией."	},
"sr":				
{	"MessageSubject"	:	"детаљи последњег састанка"	
,	"Dear"	:	"драг"	
,	"Headline"	:	"Хвала вам пуно на састанку, можете наћи испод белешке састанка."	
,	"ForAll"	:	"За све нота између наше компаније."	},
"uk":				
{	"MessageSubject"	:	"докладніше Остання зустріч"	
,	"Dear"	:	"дорогий"	
,	"Headline"	:	"Велике спасибі за зустріч, будь ласка, знайти нижче приміток до зборів."	
,	"ForAll"	:	"Для всіх нот між нашою компанією."	},
"he":				
{	"MessageSubject"	:	"פרטי הפגישה האחרונה"	
,	"Dear"	:	"יָקָר"	
,	"Headline"	:	"תודה רבה לך על הפגישה, בבקשה למצוא מתחת הערות הפגישה."	
,	"ForAll"	:	"הפתקיות בין החברה שלנו."	},
"ar":				
{	"MessageSubject"	:	"تفاصيل الاجتماع الأخير"	
,	"Dear"	:	"العزيز"	
,	"Headline"	:	"شكرا جزيلا للاجتماع، تجدون أدناه الملاحظات الاجتماع."	
,	"ForAll"	:	"لجميع الملاحظات بين شركتنا."	},
"fa":				
{	"MessageSubject"	:	"جزئیات جلسه آخرین"	
,	"Dear"	:	"عزیز"	
,	"Headline"	:	"از شما بسیار سپاسگزارم برای جلسه، لطفا زیر یادداشت های جلسه را پیدا کنید."	
,	"ForAll"	:	"برای همه یادداشت ها بین شرکت ما است."	},
"ur":				
{	"MessageSubject"	:	"آخری ملاقات کی تفصیلات"	
,	"Dear"	:	"عزیز"	
,	"Headline"	:	"آپ میٹنگ کے لئے بہت بہت شکریہ، اجلاس نوٹ کے ذیل میں تلاش کریں."	
,	"ForAll"	:	"ہماری کمپنی کے درمیان تمام نوٹوں کے لئے."	},
"bn":				
{	"MessageSubject"	:	"সর্বশেষ বৈঠকে বিস্তারিত"	
,	"Dear"	:	"প্রিয়"	
,	"Headline"	:	"আপনি মিটিং এর জন্য আপনাকে অনেক ধন্যবাদ, মিটিং নোট নীচের খুঁজে বের করুন।"	
,	"ForAll"	:	"আমাদের কোম্পানীর মধ্যে সব নোট জন্য।"	},
"hi":				
{	"MessageSubject"	:	"अंतिम मीटिंग विवरणों"	
,	"Dear"	:	"प्रिय"	
,	"Headline"	:	"आप बैठक के लिए बहुत-बहुत धन्यवाद, मीटिंग नोट्स नीचे खोजने के लिए कृपया।"	
,	"ForAll"	:	"हमारी कंपनी के बीच सभी नोट्स के लिए।"	},
"gu":				
{	"MessageSubject"	:	"છેલ્લા બેઠકમાં વિગતો"	
,	"Dear"	:	"પ્રિય"	
,	"Headline"	:	"તમે બેઠક માટે ખૂબ ખૂબ આભાર, સભા નોંધો નીચે શોધવા કૃપા કરીને."	
,	"ForAll"	:	"અમારી કંપની વચ્ચે તમામ નોંધો માટે."	},
"kn":				
{	"MessageSubject"	:	"ಕೊನೆಯ ಸಭೆಯಲ್ಲಿ ವಿವರಗಳು"	
,	"Dear"	:	"ಪ್ರೀತಿಯ"	
,	"Headline"	:	"ನೀವು ಸಭೆಯಲ್ಲಿ ತುಂಬಾ ಧನ್ಯವಾದಗಳು, ಸಭೆಯ ಟಿಪ್ಪಣಿಗಳ ಕೆಳಗೆ ಹೇಗೆ ದಯವಿಟ್ಟು."	
,	"ForAll"	:	"ನಮ್ಮ ಕಂಪನಿ ನಡುವಿನ ಎಲ್ಲಾ ಟಿಪ್ಪಣಿಗಳಿಗೆ."	},
"mr":				
{	"MessageSubject"	:	"शेवटची भेट तपशील"	
,	"Dear"	:	"प्रिय"	
,	"Headline"	:	"आपण हे संमेलन खूप धन्यवाद, बैठक टीपा खाली शोधू करा."	
,	"ForAll"	:	"आमच्या कंपनी दरम्यान सर्व नोट्स साठी."	},
"ta":				
{	"MessageSubject"	:	"கடைசியாக கூட்டம் விவரங்கள்"	
,	"Dear"	:	"அன்பே"	
,	"Headline"	:	"நீ சந்திப்புக்கு மிகவும் நன்றி, மீட்டிங் குறிப்புகளுக்கு கீழே கண்டுபிடிக்க தயவு செய்து."	
,	"ForAll"	:	"எங்கள் நிறுவனம் இடையே அனைத்து குறிப்புகள்."	},
"te":				
{	"MessageSubject"	:	"చివరి సమావేశం వివరాలు"	
,	"Dear"	:	"ప్రియమైన"	
,	"Headline"	:	"మీరు సమావేశానికి కోసం చాలా ధన్యవాదాలు, సమావేశం గమనికలు క్రింద కనుగొనడానికి దయచేసి."	
,	"ForAll"	:	"మా కంపెనీ మధ్య అన్ని గమనికలు కోసం."	},
"ml":				
{	"MessageSubject"	:	"അവസാനം യോഗം വിശദാംശങ്ങൾ"	
,	"Dear"	:	"പ്രിയ"	
,	"Headline"	:	"യോഗം വളരെ നന്ദി, യോഗം കുറിപ്പുകൾ താഴെ കണ്ടെത്താൻ ദയവായി."	
,	"ForAll"	:	"ഞങ്ങളുടെ കമ്പനി തമ്മിലുള്ള എല്ലാ കുറിപ്പുകളും വേണ്ടി."	},
"th":				
{	"MessageSubject"	:	"รายละเอียดการประชุมครั้งล่าสุด"	
,	"Dear"	:	"ที่รัก"	
,	"Headline"	:	"ขอบคุณมากสำหรับการประชุมโปรดดูด้านล่างบันทึกการประชุม"	
,	"ForAll"	:	"สำหรับบันทึกทั้งหมดระหว่าง บริษัท ของเรา"	},
"zh_cn":				
{	"MessageSubject"	:	"上次会议的详细信息"	
,	"Dear"	:	"亲"	
,	"Headline"	:	"非常感谢您对本次会议，请看下面的会议记录。"	
,	"ForAll"	:	"对于我们公司之间的所有笔记。"	},
"zh_tw":				
{	"MessageSubject"	:	"上次会议的详细信息"	
,	"Dear"	:	"亲"	
,	"Headline"	:	"非常感谢您对本次会议，请看下面的会议记录。"	
,	"ForAll"	:	"对于我们公司之间的所有笔记。"	},
"ja":				
{	"MessageSubject"	:	"最後の会議の詳細"	
,	"Dear"	:	"親愛な"	
,	"Headline"	:	"会議のためにありがとうございました、会議メモの下に見つけてください。"	
,	"ForAll"	:	"私達の会社との間のすべての注意事項について。"	},
"ko":				
{	"MessageSubject"	:	"마지막 회의 세부 정보"	
,	"Dear"	:	"소중한"	
,	"Headline"	:	"회의 주셔서 대단히 감사합니다, 회의 노트를 검색 할 수 있습니다."	
,	"ForAll"	:	"우리의 회사 사이의 모든 참고하십시오."	}}	 // Bitti		
    return language[lang];
} 
///// Finish the Email Translated words

