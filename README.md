# Typedraw 
Typedraw is a tool for creating UML diagrams from code. Works for only sequence diagrams right now, but more types of diagrams will be added soon.
[Check it out](http://anshmalik.me/typedraw/)

## Local Setup

    git clone https://github.com/AnshVM/typedraw.git
    cd typedraw
    npm install
    
   Start development server
   

    npm run dev

Run tests

    npm run test


## Manual
### Sequence diagrams
Define actors (or participants)

    actor A = "Name of actor";
    actor B = "Another actor"; 
   
  To show an action

      A -> B = "some action";

  You can create an arrow in the other direction too
 

     B -> A = "some other action";

