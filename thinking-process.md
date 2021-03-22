# Thinking process

This file follows my thinking process during this project's development; here, I will describe the ideas and decisions I made.

# Day 1

## Topic research

First, I reviewed the [Wikipedia](<https://en.wikipedia.org/wiki/Minesweeper_(video_game)>) article of the game provided by the client and two youtube [videos](https://youtu.be/7B85WbEiYf4) explaining how to play the game; an important fact is that:

- "The first click in any game will never be a mine."

So the placement of mines in the game board must be after the first play and not before.

## Game design

My first idea was that the backend service must store two representations of the game board; the first one will hold the game solution, I will call it _mines matrix_. The second representation will store the game board's current state; I will call it _view matrix_.

The train of thought behind this is that the software client will never know the _mines matrix_ as it is the game's solution, so no cheating is possible. And the _view matrix_ allows the software client to draw the current state of the game.

![matrices](assets/matrices.png)

The backend will receive a play from the user, review the stored _mines matrix_, update the _view matrix_ following the game rules, and return the new game state (_view matrix_) to the client.

### Update

An issue in my first design was that with every play sent, the backend must compute the number of adjacent mines in the cells revealed by the user. Still, those numbers are constant along the game, so they can be calculated one time only and stored.

![matrices updated](assets/matrices-2.png)

The _view matrix_ can be seen as a mask for the _mines matrix_. So at the beginning of the game, the 0's hide the numbers from the _mines matrix_.

An additional fix for the view matrix is to replace the characters representing the flag and the question sign with numbers, so it can be easily applied as a mask by element-wise product.

![matrices updated](assets/matrices-3.png)

I decided to use prime numbers for the view matrix as it provides an easy way to pinpoint if the result of the product-wise product is a flag or a question sign (e.g., if the cell can be divided by 3, it is a flag).