namespace Licenta
{
    public static class Simulator
    {
        public static CircuitElement[][] Simulate(CircuitElement[][] circuit)
        {
            for (int row = 0; row < circuit.GetLength(0); row++)
                for (int col = 0; col < circuit[row].Length; col++)
                    if (circuit[row][col].Letter == 'b')
                        TraverseFromBattery(circuit, row, col);

            return circuit;
        }

        public static void TraverseFromBattery(CircuitElement[][] circuit, int row, int col)
        {
            // pune sa fie facut din input pe baza rotatiei
            // momentan, vezi doar de unde iese fir

            circuit[row][col].Active = true;

            if (row > 0) TraverseFromWire(circuit, 'S', row - 1, col);
            if (row < circuit.GetLength(0) - 1) TraverseFromWire(circuit, 'N', row + 1, col);
            if (col > 0) TraverseFromWire(circuit, 'E', row, col - 1);
            if (col < circuit[row].Length - 1) TraverseFromWire(circuit, 'W', row, col + 1);
        }

        public static void TraverseFromWire(CircuitElement[][] circuit, char cameFrom, int row, int col)
        {
            if (circuit[row][col].Letter == '0') return;
            else if (circuit[row][col].Letter == 'l') HandleLightbulb(circuit, row, col);

            else if (circuit[row][col].Letter == 'c')
            {
                circuit[row][col].Active = true;

                if (row > 0 && cameFrom != 'N') TraverseFromWire(circuit, 'S', row - 1, col);
                if (row < circuit.GetLength(0) - 1 && cameFrom != 'S') TraverseFromWire(circuit, 'N', row + 1, col);
                if (col > 0 && cameFrom != 'W') TraverseFromWire(circuit, 'E', row, col - 1);
                if (col < circuit[row].Length - 1 && cameFrom != 'E') TraverseFromWire(circuit, 'W', row, col + 1);
            }

            else throw new Exception("unsupported letter");
        }

        public static void HandleLightbulb(CircuitElement[][] circuit, int row, int col)
        {
            circuit[row][col].Active = true;
        }
    }
}
