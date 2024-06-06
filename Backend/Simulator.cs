namespace Licenta
{
    public static class Simulator
    {
        public static void ResetCircuit(CircuitElement[][] circuit)
        {
            for (int row = 0; row < circuit.GetLength(0); row++)
                for (int col = 0; col < circuit[row].Length; col++)
                    circuit[row][col].Active = false;
        }

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
            int rotation = circuit[row][col].Rotation / 90;
            circuit[row][col].Active = true;

            if (row > 0 && rotation == 0) TraverseGeneral(circuit, 'S', row - 1, col);
            if (row < circuit.GetLength(0) - 1 && rotation == 2) TraverseGeneral(circuit, 'N', row + 1, col);
            if (col > 0 && rotation == 1) TraverseGeneral(circuit, 'E', row, col - 1);
            if (col < circuit[row].Length - 1 && rotation == 3) TraverseGeneral(circuit, 'W', row, col + 1);
        }

        public static void TraverseGeneral(CircuitElement[][] circuit, char cameFrom, int row, int col)
        {
            if (circuit[row][col].Letter == '0') return;
            else if (circuit[row][col].Letter == 'l') HandleLightbulb(circuit, cameFrom, row, col);

            else if (circuit[row][col].Letter == 'b') return; // battery does nothing when you go in it again

            else if (circuit[row][col].Letter == 's') HandleSwitch(circuit, cameFrom, row, col); 

            else if (circuit[row][col].Letter == 'c')
            {
                circuit[row][col].Active = true;

                if (row > 0 && cameFrom != 'N') TraverseGeneral(circuit, 'S', row - 1, col);
                if (row < circuit.GetLength(0) - 1 && cameFrom != 'S') TraverseGeneral(circuit, 'N', row + 1, col);
                if (col > 0 && cameFrom != 'W') TraverseGeneral(circuit, 'E', row, col - 1);
                if (col < circuit[row].Length - 1 && cameFrom != 'E') TraverseGeneral(circuit, 'W', row, col + 1);
            }

            else throw new Exception("unsupported letter");
        }

        public static void HandleLightbulb(CircuitElement[][] circuit, char cameFrom, int row, int col)
        {
            if (CameFromValidDirection(cameFrom, circuit[row][col].Rotation / 90) == false) return;

            circuit[row][col].Active = true;

            if (cameFrom == 'N' && row < circuit.GetLength(0) - 1) TraverseGeneral(circuit, 'N', row + 1, col);
            if (cameFrom == 'S' && row > 0) TraverseGeneral(circuit, 'S', row - 1, col);
            if (cameFrom == 'W' && col < circuit[row].Length - 1) TraverseGeneral(circuit, 'W', row, col + 1);
            if (cameFrom == 'E' && col > 0) TraverseGeneral(circuit, 'S', row, col - 1);
        }

        public static void HandleSwitch(CircuitElement[][] circuit, char cameFrom, int row, int col) 
        {
            if (CameFromValidDirection(cameFrom, circuit[row][col].Rotation / 90) == false) return;

            if (circuit[row][col].IsTurnedOn)
            {
                circuit[row][col].Active = true;

                if (cameFrom == 'N' && row < circuit.GetLength(0) - 1) TraverseGeneral(circuit, 'N', row + 1, col);
                if (cameFrom == 'S' && row > 0) TraverseGeneral(circuit, 'S', row - 1, col);
                if (cameFrom == 'W' && col < circuit[row].Length - 1) TraverseGeneral(circuit, 'W', row, col + 1);
                if (cameFrom == 'E' && col > 0) TraverseGeneral(circuit, 'S', row, col - 1);
            }
            else return;
        }

        public static bool CameFromValidDirection(char cameFrom, int rotation)
        {
            if ((rotation == 0 || rotation == 2) && (cameFrom == 'N' || cameFrom == 'S'))
                return true;

            if ((rotation == 1 || rotation == 3) && (cameFrom == 'E' || cameFrom == 'W'))
                return true;

            return false;
        }
    }
}
