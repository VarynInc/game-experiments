/**
 * A Klondike Solitaire game generated from lovable.dev.
 */
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { RotateCcw, Trophy, Clock } from "lucide-react";

declare global {
  interface Window {
    createjs: any;
  }
}

interface GameCard {
  suit: string;
  rank: string;
  value: number;
  color: string;
  faceUp: boolean;
  x: number;
  y: number;
  displayObject?: any;
}

interface DragState {
  isDragging: boolean;
  draggedCard: GameCard | null;
  draggedCards: GameCard[];
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
}

export const Solitaire = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<any>(null);
  const [gameState, setGameState] = useState<{
    stock: GameCard[];
    waste: GameCard[];
    foundations: GameCard[][];
    tableau: GameCard[][];
    moves: number;
    time: number;
    gameWon: boolean;
  }>({
    stock: [],
    waste: [],
    foundations: [[], [], [], []],
    tableau: [[], [], [], [], [], [], []],
    moves: 0,
    time: 0,
    gameWon: false,
  });
  
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedCard: null,
    draggedCards: [],
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
  });

  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const cardWidth = 60;
  const cardHeight = 84;

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://code.createjs.com/1.0.0/createjs.min.js';
    script.onload = initializeGame;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!gameState.gameWon) {
        setGameState(prev => ({ ...prev, time: prev.time + 1 }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.gameWon]);

  const createDeck = (): GameCard[] => {
    const deck: GameCard[] = [];
    suits.forEach(suit => {
      ranks.forEach((rank, index) => {
        deck.push({
          suit,
          rank,
          value: index + 1,
          color: suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black',
          faceUp: false,
          x: 0,
          y: 0,
        });
      });
    });
    return shuffleDeck(deck);
  };

  const shuffleDeck = (deck: GameCard[]): GameCard[] => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const initializeGame = () => {
    if (!window.createjs || !canvasRef.current) return;

    const stage = new window.createjs.Stage(canvasRef.current);
    stageRef.current = stage;
    
    stage.enableMouseOver(10);
    window.createjs.Touch.enable(stage);

    // Add mouse event listeners for drag and drop
    stage.addEventListener("stagemousedown", handleMouseDown);
    stage.addEventListener("stagemousemove", handleMouseMove);
    stage.addEventListener("stagemouseup", handleMouseUp);

    newGame();
  };

  const newGame = () => {
    if (!stageRef.current) return;

    const deck = createDeck();
    const newGameState = {
      stock: [],
      waste: [],
      foundations: [[], [], [], []] as GameCard[][],
      tableau: [[], [], [], [], [], [], []] as GameCard[][],
      moves: 0,
      time: 0,
      gameWon: false,
    };

    // Deal cards to tableau
    let cardIndex = 0;
    for (let col = 0; col < 7; col++) {
      for (let row = 0; row <= col; row++) {
        const card = deck[cardIndex++];
        card.faceUp = row === col;
        newGameState.tableau[col].push(card);
      }
    }

    // Remaining cards go to stock
    newGameState.stock = deck.slice(cardIndex);

    setGameState(newGameState);
    renderGame(newGameState);
    toast("New game started! Good luck!");
  };

  const handleMouseDown = (event: any) => {
    const card = getCardAtPosition(event.stageX, event.stageY);
    if (!card || !card.faceUp) return;

    // Check if card can be dragged
    const draggedCards = getMovableCards(card);
    if (draggedCards.length === 0) return;

    setDragState({
      isDragging: true,
      draggedCard: card,
      draggedCards,
      startX: card.x,
      startY: card.y,
      offsetX: event.stageX - card.x,
      offsetY: event.stageY - card.y,
    });
  };

  const handleMouseMove = (event: any) => {
    if (!dragState.isDragging || !dragState.draggedCard) return;

    const newX = event.stageX - dragState.offsetX;
    const newY = event.stageY - dragState.offsetY;

    // Update positions of dragged cards
    dragState.draggedCards.forEach((card, index) => {
      card.x = newX;
      card.y = newY + index * 20;
      if (card.displayObject) {
        card.displayObject.x = card.x;
        card.displayObject.y = card.y;
      }
    });

    stageRef.current.update();
  };

  const handleMouseUp = (event: any) => {
    if (!dragState.isDragging || !dragState.draggedCard) return;

    const dropTarget = getDropTarget(event.stageX, event.stageY);
    const isValidMove = validateMove(dragState.draggedCards, dropTarget);

    if (isValidMove && dropTarget) {
      // Execute the move
      executeMove(dragState.draggedCards, dropTarget);
      setGameState(prev => ({ ...prev, moves: prev.moves + 1 }));
      toast("Good move!");
    } else {
      // Return cards to original position
      dragState.draggedCards.forEach((card, index) => {
        card.x = dragState.startX;
        card.y = dragState.startY + index * 20;
        if (card.displayObject) {
          card.displayObject.x = card.x;
          card.displayObject.y = card.y;
        }
      });
      stageRef.current.update();
    }

    setDragState({
      isDragging: false,
      draggedCard: null,
      draggedCards: [],
      startX: 0,
      startY: 0,
      offsetX: 0,
      offsetY: 0,
    });
  };

  const getCardAtPosition = (x: number, y: number): GameCard | null => {
    // Check all card positions to find which card is at this position
    const allCards = [
      ...gameState.waste,
      ...gameState.foundations.flat(),
      ...gameState.tableau.flat(),
    ];

    for (let i = allCards.length - 1; i >= 0; i--) {
      const card = allCards[i];
      if (card.faceUp && 
          x >= card.x && x <= card.x + cardWidth &&
          y >= card.y && y <= card.y + cardHeight) {
        return card;
      }
    }
    return null;
  };

  const getMovableCards = (card: GameCard): GameCard[] => {
    // Find which pile the card is in and get movable sequence
    for (let col = 0; col < gameState.tableau.length; col++) {
      const column = gameState.tableau[col];
      const cardIndex = column.indexOf(card);
      
      if (cardIndex !== -1) {
        // Check if we can move this card and all cards below it
        const movableCards = column.slice(cardIndex);
        
        // Validate sequence (alternating colors, descending ranks)
        for (let i = 0; i < movableCards.length - 1; i++) {
          const current = movableCards[i];
          const next = movableCards[i + 1];
          
          if (current.color === next.color || current.value !== next.value + 1) {
            return []; // Invalid sequence
          }
        }
        
        return movableCards;
      }
    }

    // Check if card is from waste pile (only single card can be moved)
    if (gameState.waste.includes(card)) {
      return [card];
    }

    // Check if card is from foundation (only single card can be moved)
    for (const foundation of gameState.foundations) {
      if (foundation.includes(card) && foundation[foundation.length - 1] === card) {
        return [card];
      }
    }

    return [];
  };

  const getDropTarget = (x: number, y: number): any => {
    // Check tableau columns
    for (let col = 0; col < 7; col++) {
      const colX = 20 + col * 80;
      if (x >= colX && x <= colX + cardWidth && y >= 140) {
        return { type: 'tableau', index: col };
      }
    }

    // Check foundations
    for (let i = 0; i < 4; i++) {
      const foundX = 280 + i * 80;
      if (x >= foundX && x <= foundX + cardWidth && y >= 20 && y <= 20 + cardHeight) {
        return { type: 'foundation', index: i };
      }
    }

    return null;
  };

  const validateMove = (cards: GameCard[], target: any): boolean => {
    if (!target || cards.length === 0) return false;

    const firstCard = cards[0];

    if (target.type === 'tableau') {
      const targetColumn = gameState.tableau[target.index];
      
      if (targetColumn.length === 0) {
        // Empty column - only Kings can be placed
        return firstCard.value === 13;
      }
      
      const lastCard = targetColumn[targetColumn.length - 1];
      return lastCard.color !== firstCard.color && lastCard.value === firstCard.value + 1;
    }

    if (target.type === 'foundation') {
      // Only single cards can go to foundation
      if (cards.length > 1) return false;
      
      const targetFoundation = gameState.foundations[target.index];
      
      if (targetFoundation.length === 0) {
        // Empty foundation - only Aces can be placed
        return firstCard.value === 1;
      }
      
      const lastCard = targetFoundation[targetFoundation.length - 1];
      return lastCard.suit === firstCard.suit && lastCard.value === firstCard.value - 1;
    }

    return false;
  };

  const executeMove = (cards: GameCard[], target: any) => {
    const newGameState = { ...gameState };

    // Remove cards from source
    for (let col = 0; col < newGameState.tableau.length; col++) {
      const column = newGameState.tableau[col];
      for (const card of cards) {
        const index = column.indexOf(card);
        if (index !== -1) {
          column.splice(index, cards.length);
          
          // Flip the next card if it exists and is face down
          if (column.length > 0 && !column[column.length - 1].faceUp) {
            column[column.length - 1].faceUp = true;
          }
          break;
        }
      }
    }

    // Remove from waste if applicable
    if (newGameState.waste.includes(cards[0])) {
      newGameState.waste = newGameState.waste.filter(card => !cards.includes(card));
    }

    // Remove from foundations if applicable
    for (let i = 0; i < newGameState.foundations.length; i++) {
      newGameState.foundations[i] = newGameState.foundations[i].filter(card => !cards.includes(card));
    }

    // Add cards to target
    if (target.type === 'tableau') {
      newGameState.tableau[target.index].push(...cards);
    } else if (target.type === 'foundation') {
      newGameState.foundations[target.index].push(...cards);
    }

    // Check for win condition
    const allFoundationsComplete = newGameState.foundations.every(foundation => foundation.length === 13);
    if (allFoundationsComplete) {
      newGameState.gameWon = true;
      toast("Congratulations! You won!");
    }

    setGameState(newGameState);
    renderGame(newGameState);
  };

  const renderGame = (state: typeof gameState) => {
    if (!stageRef.current) return;

    stageRef.current.removeAllChildren();
    
    // Render background areas
    renderGameAreas();
    
    // Render stock pile
    renderStock(state.stock);
    
    // Render waste pile
    renderWaste(state.waste);
    
    // Render foundations
    state.foundations.forEach((foundation, index) => {
      renderFoundation(foundation, index);
    });
    
    // Render tableau
    state.tableau.forEach((column, index) => {
      renderTableauColumn(column, index);
    });

    stageRef.current.update();
  };

  const renderGameAreas = () => {
    const stage = stageRef.current;
    
    // Stock area
    const stockArea = new window.createjs.Shape();
    stockArea.graphics.beginFill("#2d5a2d").drawRoundRect(20, 20, cardWidth, cardHeight, 8);
    stockArea.graphics.beginStroke("#4a7c4a").setStrokeStyle(2).drawRoundRect(20, 20, cardWidth, cardHeight, 8);
    stage.addChild(stockArea);
    
    // Waste area
    const wasteArea = new window.createjs.Shape();
    wasteArea.graphics.beginFill("#2d5a2d").drawRoundRect(100, 20, cardWidth, cardHeight, 8);
    wasteArea.graphics.beginStroke("#4a7c4a").setStrokeStyle(2).drawRoundRect(100, 20, cardWidth, cardHeight, 8);
    stage.addChild(wasteArea);
    
    // Foundation areas
    for (let i = 0; i < 4; i++) {
      const foundationArea = new window.createjs.Shape();
      const x = 280 + i * 80;
      foundationArea.graphics.beginFill("#2d5a2d").drawRoundRect(x, 20, cardWidth, cardHeight, 8);
      foundationArea.graphics.beginStroke("#4a7c4a").setStrokeStyle(2).drawRoundRect(x, 20, cardWidth, cardHeight, 8);
      stage.addChild(foundationArea);
    }
    
    // Tableau areas
    for (let i = 0; i < 7; i++) {
      const tableauArea = new window.createjs.Shape();
      const x = 20 + i * 80;
      tableauArea.graphics.beginFill("#2d5a2d").drawRoundRect(x, 140, cardWidth, cardHeight, 8);
      tableauArea.graphics.beginStroke("#4a7c4a").setStrokeStyle(2).drawRoundRect(x, 140, cardWidth, cardHeight, 8);
      stage.addChild(tableauArea);
    }
  };

  const renderCard = (card: GameCard, x: number, y: number): any => {
    const container = new window.createjs.Container();
    
    // Card background
    const cardBg = new window.createjs.Shape();
    if (card.faceUp) {
      cardBg.graphics.beginFill("white").drawRoundRect(0, 0, cardWidth, cardHeight, 6);
      cardBg.graphics.beginStroke("#333").setStrokeStyle(1).drawRoundRect(0, 0, cardWidth, cardHeight, 6);
    } else {
      cardBg.graphics.beginFill("#1a4a8a").drawRoundRect(0, 0, cardWidth, cardHeight, 6);
      cardBg.graphics.beginStroke("#333").setStrokeStyle(1).drawRoundRect(0, 0, cardWidth, cardHeight, 6);
      
      // Card back pattern
      const pattern = new window.createjs.Shape();
      pattern.graphics.beginFill("#2a5a9a").drawRect(5, 5, cardWidth - 10, cardHeight - 10);
      container.addChild(pattern);
    }
    
    container.addChild(cardBg);
    
    if (card.faceUp) {
      // Rank text
      const rankText = new window.createjs.Text(card.rank, "12px Arial", card.color);
      rankText.x = 5;
      rankText.y = 5;
      container.addChild(rankText);
      
      // Suit symbol
      const suitSymbol = getSuitSymbol(card.suit);
      const suitText = new window.createjs.Text(suitSymbol, "16px Arial", card.color);
      suitText.x = 5;
      suitText.y = 20;
      container.addChild(suitText);
    }
    
    container.x = x;
    container.y = y;
    card.x = x;
    card.y = y;
    card.displayObject = container;
    
    // Add click handler for stock pile
    if (gameState.stock.includes(card)) {
      container.addEventListener("click", () => handleCardClick(card));
    }
    
    return container;
  };

  const getSuitSymbol = (suit: string): string => {
    const symbols = {
      hearts: '♥',
      diamonds: '♦',
      clubs: '♣',
      spades: '♠'
    };
    return symbols[suit as keyof typeof symbols] || '';
  };

  const renderStock = (stock: GameCard[]) => {
    if (stock.length > 0) {
      const topCard = stock[stock.length - 1];
      const cardDisplay = renderCard(topCard, 20, 20);
      stageRef.current.addChild(cardDisplay);
    }
  };

  const renderWaste = (waste: GameCard[]) => {
    if (waste.length > 0) {
      const topCard = waste[waste.length - 1];
      const cardDisplay = renderCard(topCard, 100, 20);
      stageRef.current.addChild(cardDisplay);
    }
  };

  const renderFoundation = (foundation: GameCard[], index: number) => {
    if (foundation.length > 0) {
      const topCard = foundation[foundation.length - 1];
      const x = 280 + index * 80;
      const cardDisplay = renderCard(topCard, x, 20);
      stageRef.current.addChild(cardDisplay);
    }
  };

  const renderTableauColumn = (column: GameCard[], columnIndex: number) => {
    const x = 20 + columnIndex * 80;
    column.forEach((card, cardIndex) => {
      const y = 140 + cardIndex * 20;
      const cardDisplay = renderCard(card, x, y);
      stageRef.current.addChild(cardDisplay);
    });
  };

  const handleCardClick = (card: GameCard) => {
    // Handle stock pile click
    if (gameState.stock.includes(card)) {
      drawFromStock();
      return;
    }
  };

  const drawFromStock = () => {
    if (gameState.stock.length === 0) {
      // Recycle waste pile back to stock
      const newStock = [...gameState.waste].reverse();
      newStock.forEach(card => card.faceUp = false);
      
      setGameState(prev => ({
        ...prev,
        stock: newStock,
        waste: [],
        moves: prev.moves + 1
      }));
    } else {
      // Draw card from stock to waste
      const newStock = [...gameState.stock];
      const drawnCard = newStock.pop()!;
      drawnCard.faceUp = true;
      
      setGameState(prev => ({
        ...prev,
        stock: newStock,
        waste: [...prev.waste, drawnCard],
        moves: prev.moves + 1
      }));
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    renderGame(gameState);
  }, [gameState]);

  return (
    <div className="flex flex-col items-center gap-4">
      <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
        <div className="flex items-center justify-between gap-8 text-white">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Time: {formatTime(gameState.time)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Moves: {gameState.moves}</span>
          </div>
          {gameState.gameWon && (
            <div className="flex items-center gap-2 text-yellow-400">
              <Trophy className="h-4 w-4" />
              <span>You Win!</span>
            </div>
          )}
        </div>
      </Card>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={600}
          height={500}
          className="bg-green-700 rounded-lg shadow-2xl border-4 border-green-600"
        />
      </div>

      <div className="flex gap-4">
        <Button
          onClick={newGame}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          New Game
        </Button>
      </div>
    </div>
  );
};
