## TODOS
1.{
    "comment":{
        "email":"urzsairamyadav27@gmail.com",
        "amount":"0.1",
        "address":"9TkgwvNRr433tLudynoXiNhBPxfLAsR2WwnMgezvJJWS"
    }
}
only this way we have to comment in github.
here, we have to know how it hits webhook url (http://localhost:3002/hooks/catch/1/45fb2549-5030-4079-b572-db7e002cd136) from github. and make sure it connected.
2. for sending emails user has to verify.so, send the user verfication eamil, make them verify email before signing them up
  - add a new field in DB called verify, and only if user is verifed should they be able to login
3. solana reconciliation side quest - if the users solana txn fails/takes long thime/is submitted to blockchain, but your node goes down.
   wt happens then?? how can u prevent sending them twice when worker comes back up.
4. use react-flow for the UI , make it prettier
5. add images in total ceed also like whle adding actions we see images but after adding to ceed we cant see them. week 34.2 (30 mins)
// to do addd onclick to main page
//change the vedio also ,keep our app vedio
// change thoe features also according to our applictn
//if you folder section goto 100xdevs/cms repo and mplement at present wer implement only root folder

understandings for myself.
workflow: me as a user(bounty giver) thinking => 
1. first we have to verify email(then only it able to login and also send emails to bounty winner)
2. go to ceeds page and create your ceed like combination of trigger + actions (like webhook=>email+solana+email) and publish it.
3. now take webhook url and keep it in github webhook.so then it hits whenever you commented on repo(after issuse solved and pr merged, comment like ({ "comment":{
        "email":"sairamyadav694@gmail.com",
        "amount":"0.1",
        "address":"hfgdshg43689dhjgd78923e"
    }}) )so then processor creates events and push to queue.
4. workers takes those events are does the work

doubts: then how user email send from user's mail, and also how solana txn done from user's sol??
means where we are taking their credentials:
-email while SMTP credentrials.
-solana while SOL_PRIVATE_KEY.
now we have to make sure that while they are logging in VERIFY through AWS SES, and add section for taking SOL_PRIVATE_KEY of user