/* Author: Ben Paul
 * Date: 04/11/22
 * 
 * Description: The player must find all the pairs of images.
 */

    // Level 1 starts with 4 cards (2 matches)
    // Designed to only reach up to 100 cards (49 levels)
    let cardArray = [];
    const maxLevel = 49;
    const cardBackSrc = '/static/images/card-back.svg';
    const shapesList = [
        '/static/images/card-circle.svg',
        '/static/images/card-square.svg',
        '/static/images/card-star.svg',
        '/static/images/card-triangle.svg',
        '/static/images/card-plus.svg',
        '/static/images/card-arrow.svg',
        '/static/images/card-diamond.svg',
        '/static/images/card-hexagon.svg',
        '/static/images/card-heart.svg',
        '/static/images/card-cylinder.svg'
    ];

    function findCardAmountAndRow(thisLevel) {
        const number = thisLevel < maxLevel ? (thisLevel + 1) * 2 : (maxLevel + 1) * 2;
        const squareRootFloor = Math.floor(Math.sqrt(number));
        for (let f = squareRootFloor; f >= 2; f--) {
            if (number % f === 0) {
                return {
                    number: number,
                    rows: f
                }
            }
        }
    }

    function card(index, shape, solved, clicked) {
        this.index = index;
        this.shape = shape;
        this.solved = solved;
        this.clicked = clicked;
    }

    function startImageGame(thisLevel) {
        gameHeading.text('Find the Matching Images!');
        gameDiv.show();
        cardArray = [];
        let cardAmount = findCardAmountAndRow(thisLevel);
        let numberOfCards = cardAmount.number;
        let numberOfRows = cardAmount.rows;
        let numberOfColumns = numberOfCards / numberOfRows;
        let leftovers = 0;
        // Prevent columns from exceeding 10 to prevent squishing
        if (numberOfColumns > 10) {
            let columnDifference = numberOfColumns - 10;
            leftovers += columnDifference * numberOfRows;
            numberOfColumns -= columnDifference;
            numberOfRows += 1;
        }
        let shapesArray = shapesList.slice();
        shapesArray.length = numberOfCards / 2;
        arrayLength = shapesArray.length;
        listLength = shapesList.length;
        if (arrayLength > listLength) {
            for (let i = listLength; i < arrayLength; i++) {
                multiplier = Math.floor(i / listLength);
                shapesArray[i] = shapesList[i - (listLength * multiplier)];
            }
        }
        // Double shapesArray to get two of each
        let shapesLength = shapesArray.length;
        for (let i = 0; i < shapesLength; i++) {
            shapesArray.push(shapesArray[i]);
        }
        let cardIndex = -1;
        let cardsHTML = '<table style="display: flex;width: 100%;height: 100%;justify-content: center;align-items: center;">'
            + '<tbody style="display: grid;align-items: center;align-content: center;height: 100%;">';
        /*
        // Dynamically fit columns with a row height
        rowHeight = Math.floor(100 / numberOfRows);
        columnWidth = Math.floor(100 / numberOfColumns);
        */
        for (let r = 0; r < numberOfRows; r++) {
            cardsHTML += '<tr style="">';
            // Add any leftovers to last row
            if (r === numberOfRows - 1 && leftovers > 0) {
                numberOfColumns = leftovers;
            }
            for (let c = 0; c < numberOfColumns; c++) {
                let randomShapeIndex = Math.floor(Math.random() * shapesArray.length);
                let randomShape = shapesArray[randomShapeIndex];
                shapesArray.splice(randomShapeIndex, 1);
                cardIndex += 1;
                cardArray[cardIndex] = new card(cardIndex, randomShape, false, false);
                cardsHTML += '<th style=""><img id="card-'+ cardIndex +'" card_index="'
                    + cardIndex +'" class="card_image" style="" src="'+ cardBackSrc +'"></img></th>';
            }
            cardsHTML += '</tr>';
        }
        cardsHTML += '</table></tbody>';
        gameDiv.append(cardsHTML);
    }

    let timesClicked = 0;
    let firstCard;
    let firstCardID;
    let secondCard;
    let secondCardID;
    $(document.body).on("click", '.card_image', function() {
        let thisCard = $(this);
        let thisCardID = thisCard.attr('id');
        let cardIndex = parseInt(thisCard.attr('card_index'));
        let cardMatch = cardArray[cardIndex];
        if (cardMatch.clicked) {
            return;
        } else {
            timesClicked += 1;
        }
        if (timesClicked > 2) {
            if (!firstCard.solved) {
                firstCard.clicked = false;
                $("#" + firstCardID).attr('src', cardBackSrc);
            }
            firstCard = secondCard;
            firstCardID = secondCardID;
        }
        if (timesClicked > 1) {
            secondCard = cardMatch;
            secondCard.clicked = true;
            thisCard.attr('src', cardMatch.shape);
            secondCardID = thisCardID;
            if (firstCard.shape === secondCard.shape) {
                timesClicked = 0;
                firstCard.solved = true;
                secondCard.solved = true;
                for (let i = 0; i < cardArray.length; i++) {
                    if (cardArray[i].solved === false) {
                        break;
                    }
                    if (i === cardArray.length - 1) {
                        return winGame = true;
                    }
                }
            }
        } else {
            firstCard = cardMatch;
            firstCard.clicked = true;
            thisCard.attr('src', cardMatch.shape);
            firstCardID = thisCardID;
        }
    });