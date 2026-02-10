public static class Game
{
    // Uppgift 1: Skapa en tom spelplan fylld med '.'
    public static char[,] CreateBoard(int rows, int cols)
    {
        char[,] board = new char[rows, cols];
        for (int r = 0; r < rows; r++)
        {
            for (int c = 0; c < cols; c++)
            {
                board[r, c] = '.';
            }
        }
        return board;
    }

    // Uppgift 2: Placera en spelpjäs på angiven position
    public static bool PlacePiece(char[,] board, int row, int col, char piece)
    {
        int rows = board.GetLength(0);
        int cols = board.GetLength(1);
        if (row < 0 || row >= rows || col < 0 || col >= cols)
            return false;
        board[row, col] = piece;
        return true;
    }

    // Uppgift 3: Hitta en specifik pjäs och returnera dess position
    public static (int row, int col) FindPiece(char[,] board, char piece)
    {
        for (int r = 0; r < board.GetLength(0); r++)
        {
            for (int c = 0; c < board.GetLength(1); c++)
            {
                if (board[r, c] == piece)
                    return (r, c);
            }
        }
        return (-1, -1);
    }

    // Uppgift 4: Skriv ut spelplanen i ett läsbart format
    public static string BoardToString(char[,] board)
    {
        var lines = new List<string>();
        for (int r = 0; r < board.GetLength(0); r++)
        {
            var row = new List<char>();
            for (int c = 0; c < board.GetLength(1); c++)
            {
                row.Add(board[r, c]);
            }
            lines.Add(string.Join(" ", row));
        }
        return string.Join("\n", lines);
    }

    // Uppgift 5: Sortera highscores i fallande ordning
    public static int[] SortHighscores(int[] scores)
    {
        int[] copy = new int[scores.Length];
        Array.Copy(scores, copy, scores.Length);
        Array.Sort(copy);
        Array.Reverse(copy);
        return copy;
    }

    // Uppgift 6: Hitta spelarens placering i den sorterade listan
    public static int FindRank(int[] sortedScores, int playerScore)
    {
        int index = Array.IndexOf(sortedScores, playerScore);
        if (index == -1)
            return -1;
        return index + 1;
    }

    // Uppgift 7: Filtrera ut alla poäng som är över en viss tröskel
    public static int[] GetScoresAbove(int[] scores, int threshold)
    {
        return Array.FindAll(scores, s => s >= threshold);
    }

    // Uppgift 8: Beräkna min, max och medelvärde
    public static (int min, int max, double average) CalculateStats(int[] scores)
    {
        int min = scores[0];
        int max = scores[0];
        int sum = 0;
        foreach (int score in scores)
        {
            if (score < min) min = score;
            if (score > max) max = score;
            sum += score;
        }
        return (min, max, (double)sum / scores.Length);
    }
}