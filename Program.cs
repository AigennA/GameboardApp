// Huvudprogram
Console.WriteLine("=== DEL A: Spelplan ===\n");

char[,] board = CreateBoard(3, 4);

PlacePiece(board, 0, 0, 'X');
PlacePiece(board, 1, 1, 'O');
PlacePiece(board, 2, 3, 'X');


var position = FindPiece(board, 'O');
Console.WriteLine($"'O' hittad på: ({position.row}, {position.col})");

Console.WriteLine("\nSpelplan:");
Console.WriteLine(BoardToString(board));

Console.WriteLine("\n=== DEL B: Highscores ===\n");

int[] scores = { 2100, 800, 4500, 1500, 3200, 2900, 1800 };
int[] sorted = SortHighscores(scores);
Console.WriteLine($"Sorterad: [{string.Join(", ", sorted)}]");

int rank = FindRank(sorted, 2100);
Console.WriteLine($"Rank för 2100: #{rank}");

var stats = CalculateStats(scores);
Console.WriteLine($"Stats: Min={stats.min}, Max={stats.max}, Medel={stats.average}");

// --- Metoder ---

static char[,] CreateBoard(int rows, int cols)
{
    var board = new char[rows, cols];
    for (int r = 0; r < rows; r++)
    {
        for (int c = 0; c < cols; c++)
        {
            board[r, c] = '.';
        }
    }
    return board;
}

static bool PlacePiece(char[,] board, int row, int col, char piece)
{
    int rows = board.GetLength(0);
    int cols = board.GetLength(1);

    if (row < 0 || row >= rows || col < 0 || col >= cols)
        return false;

    board[row, col] = piece;
    return true;
}

static (int row, int col) FindPiece(char[,] board, char piece)
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

static string BoardToString(char[,] board)
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

static int[] SortHighscores(int[] scores)
{
    int[] copy = new int[scores.Length];
    Array.Copy(scores, copy, scores.Length);
    Array.Sort(copy);
    Array.Reverse(copy);
    return copy;
}

static int FindRank(int[] sortedScores, int playerScore)
{
    int index = Array.IndexOf(sortedScores, playerScore);
    if (index == -1)
        return -1;
    return index + 1;
}

static int[] GetScoresAbove(int[] scores, int threshold)
{
    return Array.FindAll(scores, s => s >= threshold);
}

static (int min, int max, double average) CalculateStats(int[] scores)
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