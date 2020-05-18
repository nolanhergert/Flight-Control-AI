# Flight-Control-AI
Shall we play a game?

Demo at: https://nolanhergert.github.io/Flight-Control-AI/


Notes and learnings

Try to break things down into simple, solvable chunks (even of fake problems) so you don't get overwhelmed.

### SOLID code
Easy when it's a robot with discrete parts, but hard when you have to make it from scratch.

Should the AI be a part of the chopper? Nope. It knows about all the choppers.

Should the game drawer also do the AI? Nope, separate responsibilities.

### Tests
Allow you to quickly stress test your <always initially error-filled> code quickly and early on. Your future self will thank you!
  * Least stress to do Test-Driven-Development (one change at a time), but I haven't emotionally gotten there yet. 

If you have the additional ability to write unit tests (you always do!), you can focus on only a few things at a time.

You'll find things are a lot easier to unit test when your variables are passed into the function and not globals.

### Computer Learning 
Yeah...don't really know how to do this well yet.

<rant>
  * Don't do this for problems where the solution is solvable. Overkill...so you should still learn traditional machine learning techniques
  * However, they are surprisingly solving problems where traditional programming is *impossible*, but humans still know how to do it. Voice recognition, Go, etc.
    * Can it solve world peace? Probably not...
