using MathNet.Numerics.LinearAlgebra;

namespace Licenta
{
    public class Simulator
    {
        // clean code important rule. if method longer than height of the screen is bad practice. WTF ARE YOU DOING HERE?????? Stephen King wants to collaborate with you for his books
        public void CheckIfCircuitValid(CircuitElement[][] circuit, char cameFrom, int row, int col, bool hasResistance)
        {
            // CUR? EL?
            CircuitElement curEl = circuit[row][col];
            char curLet = curEl.Letter;

            // if we landed on nothing, stop this trail
            // corect
            if (curLet == '0') return;

            // if we came from valid direction, keep going, otherwise stop
            // this applies for switch, light, rezistor, amper, volt, watt, ohm meters and battery
            if (curLet == 's' || curLet == 'l' || curLet == 'r' || curLet == 'a' || curLet == 'v' || curLet == 'w' || curLet == 'o' || curLet == 'b')
                if (!CameFromValidDirection2T(cameFrom, curEl.Rotation / 90))
                    return;

            // this applies for battery, if here and we have resistance, good. otherwise this circuit is invalid
            if (curLet == 'b')
            {
                // not like us
                if (!hasResistance)
                    INVALID_CIRCUIT = true;

                return;
            }
            // wdym not ok?
            bool ok = false;
            // wdym lasa curul?
            if (curLet != 'c')
                ok = true;

            // add where we came from
            if (!cameFroms.ContainsKey((row, col))) cameFroms.Add((row, col), "");
            cameFroms[(row, col)] += cameFrom;

            // if we came from the same place twice, then the circuit is invalid
            if (cameFroms[(row, col)].Count(x => x == 'N') > 1 ||
                cameFroms[(row, col)].Count(x => x == 'S') > 1 ||
                cameFroms[(row, col)].Count(x => x == 'E') > 1 ||
                cameFroms[(row, col)].Count(x => x == 'W') > 1)
                INVALID_CIRCUIT = true;

            if (row > 0 && cameFrom != 'N') CheckIfCircuitValid(circuit, 'S', row - 1, col, hasResistance || ok);
            if (row < circuit.GetLength(0) - 1 && cameFrom != 'S') CheckIfCircuitValid(circuit, 'N', row + 1, col, hasResistance || ok);
            if (col > 0 && cameFrom != 'W') CheckIfCircuitValid(circuit, 'E', row, col - 1, hasResistance || ok);
            if (col < circuit[row].Length - 1 && cameFrom != 'E') CheckIfCircuitValid(circuit, 'W', row, col + 1, hasResistance || ok);
        }

        /// V = I * R
        /// P = V * I
        /// 
        /// Voltmetru = R inf
        /// Ampermetru = R 0
        /// 
        /// Any node can be ground, just make sure to add the lowest number < 0 to all volts so that min becomes 0
        /// 
        /// First, we will calculate Voltage using MNA (Modified Node Analysis)
        /// Afterwards, we will calculate Intensity using KCL (Kirchoff's Current Law)

        /// There are 2 ways the circuit can be invalid:
        /// 1. Wire loop (in any given node, wires without resistance can form loops)
        /// We will treat this by taking any given wire, putting its neighbours in a list
        /// For said list we create a new list with new neighbours (except the wire we just came from)
        /// We keep going until no more elements in the list (good ending) or any wire repeats (bad ending)
        /// 
        /// 2. Source loop (there is any wire path that connects both + end and - end of the source)
        /// Also, ignores other batteries, open switches, ampermeters, basically anything with 0R)
        /// We will treat this by starting from the battery, and traversing wires like last time
        /// This time however we will not check repetitions, and if we end up with a component, we will not stop
        /// We will add their other wire end to the list.
        /// When we find a wire end that has the initial battery (bad end), but when list runs out (good end)

        /// For Future Silviu, please:
        /// 1. Create nodes and branches
        /// 2. Check validity for the 2 problems explained earlier
        /// 3. Do MNA
        /// 4. Do KCL
        /// 

        /// ASSUME ALL CURRENTS CLOCKWISE
        /// SHAME ON YOU TO ASSUME THAT

        /// tranzistori poate. dupa prima simulare, se verifica tranzistorii si daca au destul voltaj, se reruleaza simularea cu ei deschisi

        // this stores the positions and each char in string is a direction we came from
        Dictionary<(int row, int col), string> cameFroms;

        // this stores if the circuit is invalid
        public bool INVALID_CIRCUIT;

        // this stores the positions and each char in the string is another path that can be taken
        // when we first get here, we write down all other possible paths
        // when we return here, we take out the direction we just came from
        // when only 1 char is left, that is the path to keep going
        Dictionary<(int row, int col), string> intersections;

        int[,] visited;
        List<WireNode> nodes;
        List<Component> batteries;
        Dictionary<(int row, int col), Component> componentDict;

        public Simulator(CircuitElement[][] circuit)
        {
            cameFroms = new();
            intersections = new();
            INVALID_CIRCUIT = false;

            visited = new int[circuit.GetLength(0), circuit[0].Length];
            nodes = [];
            batteries = [];

            componentDict = [];
        }

        public void ResetCircuit(CircuitElement[][] circuit)
        {
            for (int row = 0; row < circuit.GetLength(0); row++)
                for (int col = 0; col < circuit[row].Length; col++)
                    circuit[row][col].Active = false;
        }

        public CircuitElement[][] Simulate(CircuitElement[][] circuit)
        {
            for (int row = 0; row < circuit.GetLength(0); row++)
                for (int col = 0; col < circuit[row].Length; col++)
                    if (circuit[row][col].Letter == 'b')
                    {
                        // check if valid
                        int rotation = circuit[row][col].Rotation / 90;
                        circuit[row][col].Active = true;

                        if (row > 0 && rotation == 0) TraverseGeneral(circuit, 'S', row - 1, col);
                        if (row < circuit.GetLength(0) - 1 && rotation == 2) TraverseGeneral(circuit, 'N', row + 1, col);
                        if (col > 0 && rotation == 1) TraverseGeneral(circuit, 'E', row, col - 1);
                        if (col < circuit[row].Length - 1 && rotation == 3) TraverseGeneral(circuit, 'W', row, col + 1);

                        // if valid then simulate
                        TraverseFromBattery(circuit, row, col);
                    }

            return circuit;
        }

        public void TraverseFromBattery(CircuitElement[][] circuit, int row, int col)
        {
            int rotation = circuit[row][col].Rotation / 90;
            circuit[row][col].Active = true;

            if (row > 0 && rotation == 0) TraverseGeneral(circuit, 'S', row - 1, col);
            if (row < circuit.GetLength(0) - 1 && rotation == 2) TraverseGeneral(circuit, 'N', row + 1, col);
            if (col > 0 && rotation == 1) TraverseGeneral(circuit, 'E', row, col - 1);
            if (col < circuit[row].Length - 1 && rotation == 3) TraverseGeneral(circuit, 'W', row, col + 1);
        }

        public void TraverseGeneral(CircuitElement[][] circuit, char cameFrom, int row, int col)
        {
            CircuitElement curEl = circuit[row][col];
            char curLet = curEl.Letter;

            // if we landed on nothing, stop this trail
            if (curLet == '0') return;

            // if we came from valid direction, keep going, otherwise stop
            // this applies for switch, light, rezistor, amper, volt, watt, ohm meters
            if (curLet == 's' || curLet == 'l' || curLet == 'r' || curLet == 'a' || curLet == 'v' || curLet == 'w' || curLet == 'o')
                if (!CameFromValidDirection2T(cameFrom, curEl.Rotation / 90))
                    return;

            if (curLet == 'l') HandleLightbulb(circuit, cameFrom, row, col);

            else if (curLet == 'b') return; // battery does nothing when you go in it again

            else if (curLet == 's') HandleSwitch(circuit, cameFrom, row, col);

            else if (curLet == 'c')
            {
                circuit[row][col].Active = true;

                if (row > 0 && cameFrom != 'N') TraverseGeneral(circuit, 'S', row - 1, col);
                if (row < circuit.GetLength(0) - 1 && cameFrom != 'S') TraverseGeneral(circuit, 'N', row + 1, col);
                if (col > 0 && cameFrom != 'W') TraverseGeneral(circuit, 'E', row, col - 1);
                if (col < circuit[row].Length - 1 && cameFrom != 'E') TraverseGeneral(circuit, 'W', row, col + 1);
            }

            else throw new Exception("unsupported letter");
        }

        public void HandleLightbulb(CircuitElement[][] circuit, char cameFrom, int row, int col)
        {
            if (CameFromValidDirection2T(cameFrom, circuit[row][col].Rotation / 90) == false) return;

            circuit[row][col].Active = true;

            if (cameFrom == 'N' && row < circuit.GetLength(0) - 1) TraverseGeneral(circuit, 'N', row + 1, col);
            if (cameFrom == 'S' && row > 0) TraverseGeneral(circuit, 'S', row - 1, col);
            if (cameFrom == 'W' && col < circuit[row].Length - 1) TraverseGeneral(circuit, 'W', row, col + 1);
            if (cameFrom == 'E' && col > 0) TraverseGeneral(circuit, 'S', row, col - 1);
        }

        public void HandleSwitch(CircuitElement[][] circuit, char cameFrom, int row, int col)
        {
            if (CameFromValidDirection2T(cameFrom, circuit[row][col].Rotation / 90) == false) return;

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

        public bool CameFromValidDirection2T(char cameFrom, int rotation)
        {
            if ((rotation == 0 || rotation == 2) && (cameFrom == 'N' || cameFrom == 'S'))
                return true;

            if ((rotation == 1 || rotation == 3) && (cameFrom == 'E' || cameFrom == 'W'))
                return true;

            return false;
        }

        // worse rewrites
        public bool CheckValidDirection(CircuitElement[][] circuit, int row, int col)
        {
            return false;
        }

        public void ChooseTraverse(CircuitElement[][] circuit, char cameFrom, int row, int col)
        {
            if (visited[row, col] == 1) return;
            visited[row, col] = 1;

            // wip
        }

        public void TraverseFromWire(CircuitElement[][] circuit, char cameFrom, int row, int col)
        {
            if (row > 0 && cameFrom != 'N') TraverseGeneral(circuit, 'S', row - 1, col);
            if (row < circuit.GetLength(0) - 1 && cameFrom != 'S') TraverseGeneral(circuit, 'N', row + 1, col);
            if (col > 0 && cameFrom != 'W') TraverseGeneral(circuit, 'E', row, col - 1);
            if (col < circuit[row].Length - 1 && cameFrom != 'E') TraverseGeneral(circuit, 'W', row, col + 1);
        }

        public void TraverseFrom2T(CircuitElement[][] circuit, char cameFrom, int row, int col)
        {
            if (cameFrom == 'N' && row < circuit.GetLength(0) - 1) ChooseTraverse(circuit, 'N', row + 1, col);
            if (cameFrom == 'S' && row > 0) ChooseTraverse(circuit, 'S', row - 1, col);
            if (cameFrom == 'W' && col < circuit[row].Length - 1) ChooseTraverse(circuit, 'W', row, col + 1);
            if (cameFrom == 'E' && col > 0) ChooseTraverse(circuit, 'S', row, col - 1);
        }



        /// PILLAR 1: COMPUTE GRAPH 

        // Checks if coords are within the boundaries of the circuit
        public bool WithinBounds(int row, int col, CircuitElement[][] circuit)
        {
            if (row >= circuit.GetLength(0) - 1) return false;
            if (row < 0) return false;
            if (col >= circuit[row].Length - 1) return false;
            if (col < 0) return false;

            return true;
        }

        // Check consent universally
        public bool CheckIfCanAny(CircuitElement el, char cameFrom)
        {
            if (el.Letter == '0') return false;
            if (el.Letter == 'c') return CheckIfCanWire(el, cameFrom);
            if (el.Letter == 'S') return CheckIfCanSwitchAlt(el, cameFrom);
            return CheckIfCan2T(el, cameFrom);
        }

        // Check wire consent
        public bool CheckIfCanWire(CircuitElement el, char cameFrom)
        {
            return true;
        }

        // Check 2T consent
        public bool CheckIfCan2T(CircuitElement el, char cameFrom)
        {
            int rotate = el.Rotation / 90;

            if (cameFrom == 'S' || cameFrom == 'N')
                if (rotate == 0 || rotate == 2)
                    return true;

            if (cameFrom == 'E' || cameFrom == 'W')
                if (rotate == 1 || rotate == 3)
                    return true;

            return false;
        }

        // Check SwitchAlt consent
        public bool CheckIfCanSwitchAlt(CircuitElement el, char cameFrom)
        {
            int rotate = el.Rotation / 90;

            if (cameFrom == 'S')
                if (rotate == 0 || (rotate == 1 && el.IsTurnedOn) || (rotate == 3 && !el.IsTurnedOn))
                    return true;

            if (cameFrom == 'E')
                if (rotate == 1 || (rotate == 2 && el.IsTurnedOn) || (rotate == 0 && !el.IsTurnedOn))
                    return true;

            if (cameFrom == 'N')
                if (rotate == 2 || (rotate == 3 && el.IsTurnedOn) || (rotate == 1 && !el.IsTurnedOn))
                    return true;

            if (cameFrom == 'W')
                if (rotate == 3 || (rotate == 0 && el.IsTurnedOn) || (rotate == 2 && !el.IsTurnedOn))
                    return true;

            return false;
        }

        // Get next from 2T
        public (int row, int col) GetNextFrom2T(CircuitElement[][] circuit, int row, int col, char cameFrom)
        {
            int rotation = circuit[row][col].Rotation / 90;

            if (cameFrom == 'S')
                if (rotation == 0 || rotation == 2)
                    if (WithinBounds(row - 1, col, circuit))
                        return (row - 1, col);

            if (cameFrom == 'N')
                if (rotation == 0 || rotation == 2)
                    if (WithinBounds(row + 1, col, circuit))
                        return (row + 1, col);

            if (cameFrom == 'E')
                if (rotation == 1 || rotation == 3)
                    if (WithinBounds(row, col - 1, circuit))
                        return (row, col - 1);

            if (cameFrom == 'W')
                if (rotation == 1 || rotation == 3)
                    if (WithinBounds(row, col + 1, circuit))
                        return (row, col + 1);

            throw new Exception("man came outta nowhere");
        }

        // Get next from AltSwitch
        public (int row, int col, char from) GetNextFromSwitchAlt(CircuitElement[][] circuit, int row, int col, char cameFrom)
        {
            int rotation = circuit[row][col].Rotation / 90;
            bool turnOn = circuit[row][col].IsTurnedOn;

            if (cameFrom == 'S')
            {
                if (rotation == 0)
                {
                    if (!turnOn && WithinBounds(row, col + 1, circuit))
                        return (row, col + 1, 'W');
                    else if (turnOn && WithinBounds(row, col - 1, circuit))
                        return (row, col - 1, 'E');
                }
                else if (rotation == 1 && turnOn && WithinBounds(row, col + 1, circuit))
                    return (row, col + 1, 'W');
                else if (rotation == 3 && !turnOn && WithinBounds(row, col - 1, circuit))
                    return (row, col - 1, 'E');
            }

            if (cameFrom == 'N')
            {
                if (rotation == 2)
                {
                    if (!turnOn && WithinBounds(row, col - 1, circuit))
                        return (row, col - 1, 'E');
                    else if (turnOn && WithinBounds(row, col + 1, circuit))
                        return (row, col + 1, 'W');
                }
                else if (rotation == 3 && turnOn && WithinBounds(row, col - 1, circuit))
                    return (row, col - 1, 'E');
                else if (rotation == 1 && !turnOn && WithinBounds(row, col + 1, circuit))
                    return (row, col + 1, 'W');
            }

            if (cameFrom == 'E')
            {
                if (rotation == 1)
                {
                    if (!turnOn && WithinBounds(row - 1, col, circuit))
                        return (row - 1, col, 'S');
                    else if (turnOn && WithinBounds(row + 1, col, circuit))
                        return (row + 1, col, 'N');
                }
                else if (rotation == 2 && turnOn && WithinBounds(row - 1, col, circuit))
                    return (row - 1, col, 'S');
                else if (rotation == 0 && !turnOn && WithinBounds(row + 1, col, circuit))
                    return (row + 1, col, 'N');
            }

            if (cameFrom == 'W')
            {
                if (rotation == 3)
                {
                    if (!turnOn && WithinBounds(row + 1, col, circuit))
                        return (row + 1, col, 'N');
                    else if (turnOn && WithinBounds(row - 1, col, circuit))
                        return (row - 1, col, 'S');
                }
                else if (rotation == 0 && turnOn && WithinBounds(row + 1, col, circuit))
                    return (row + 1, col, 'N');
                else if (rotation == 2 && !turnOn && WithinBounds(row - 1, col, circuit))
                    return (row - 1, col, 'S');
            }

            throw new Exception("no really where did you come from");
        }

        // Create nodes and branches
        // We will start from a battery, and work our way from there.
        public void BeginNodeCompute(CircuitElement[][] circuit)
        {
            for (int row = 0; row < circuit.GetLength(0); row++)
                for (int col = 0; col < circuit[row].Length; col++)
                    if (circuit[row][col].Letter == 'b' && visited[row, col] == 0)
                    {
                        visited[row, col]++;

                        // We found a battery
                        // Create node and component, then add wire branch to node and battery to node ends
                        WireNode node = new WireNode();
                        nodes.Add(node);

                        // Begin node
                        int rotate = circuit[row][col].Rotation / 90;
                        char tempFrom = rotate == 0 ? 'S' :
                                        (rotate == 1 ? 'E' :
                                        (rotate == 2 ? 'N' :
                                        (rotate == 3 ? 'W' : '0'))); 

                        NodeCompute(circuit, node, row, col, tempFrom);
                    }
        }

        public void NodeCompute(CircuitElement[][] circuit, WireNode thisNode, int startRow, int startCol, char cameFrom)
        {
            // Now, we add the fresh new guy in our queue list
            // For each guy in q list, we see how many paths possible and what type they are
            // If they are component, we put them in ends and in potentialNewNode list
            // If they are wire and have one path, we put them in current branch
            // Otherwise, we put them in current branch and make a newBranches list.

            List<(Component comp, int row, int col, char cFrom)> potentialNewNode = []; // This is funny cause when no more branches take this, fa nod, iar dupa doar vezi daca end si begin au ceva. Daca da, discard
            List<(WireBranch wb, int row, int col, char cFrom)> newBranches = [];

            Component startComp;

            if (!componentDict.ContainsKey((startRow, startCol)))
            {
                startComp = new Component(circuit[startRow][startCol]);
                componentDict.Add((startRow, startCol), startComp); // this one never gets called for components that are surrounded by just one node, so we have to call it again later
            }
            else 
                startComp = componentDict[(startRow, startCol)];

            if (startComp.element.Letter == 'b')
            {
                batteries.Add(startComp);
                startComp.batteryCurrentCameFromGoodSide = true;
            }

            WireBranch startBranch = new(startComp, thisNode);
            startComp.end = startBranch;

            // Get start of branch
            var aux = GetNextFrom2T(circuit, startRow, startCol, cameFrom);
            newBranches.Add((startBranch, aux.row, aux.col, cameFrom));

            thisNode.ends.Add(startComp);
            thisNode.ownBranches.Add(startBranch);

            while (newBranches.Count > 0)
            {
                // check current start:
                // visit it, and then...
                // if it's nothing, gg i guess
                // if it's a component, this wire is done (even if empty), we check if comp exists in dict (if not we make it), then we assign it then put component in node ends and wire end 
                // if it's alt switch, we go to where it leads
                // if it's regular switch, we go to where it leads, assuming its turned on
                // if it's wire, we see how many paths it has. if it's 1 path, we continue on said path, otherwise we make newBranches
                
                (WireBranch branch, int thisRow, int thisCol, char previousWasFrom) = newBranches[0];

                while (true)
                {
                    // check if it was possible to get here, if not, scram
                    if (CheckIfCanAny(circuit[thisRow][thisCol], previousWasFrom) == false)
                        break;

                    // wire loop
                    if (visited[thisRow, thisCol] == 2) INVALID_CIRCUIT = true;
                    if (INVALID_CIRCUIT) return;
                    visited[thisRow, thisCol]++;

                    if (circuit[thisRow][thisCol].Letter == '0') // nothing
                    {
                        break;
                    }

                    else if (circuit[thisRow][thisCol].Letter == 'S') // altswitch
                    {
                        branch.wires.Add(circuit[thisRow][thisCol]);
                        (thisRow, thisCol, previousWasFrom) = GetNextFromSwitchAlt(circuit, thisRow, thisCol, previousWasFrom);
                    }

                    else if (circuit[thisRow][thisCol].Letter == 's') // switch
                    {
                        if (circuit[thisRow][thisCol].IsTurnedOn == false)
                            break;

                        branch.wires.Add(circuit[thisRow][thisCol]);
                        (thisRow, thisCol) = GetNextFrom2T(circuit, thisRow, thisCol, previousWasFrom);
                    }

                    else if (circuit[thisRow][thisCol].Letter == 'a') // ammeter (treat as wire)
                    {
                        branch.wires.Add(circuit[thisRow][thisCol]);
                        (thisRow, thisCol) = GetNextFrom2T(circuit, thisRow, thisCol, previousWasFrom);
                    }

                    else if (circuit[thisRow][thisCol].Letter == 'c') // wire
                    {
                        branch.wires.Add(circuit[thisRow][thisCol]);

                        // see all possible paths
                        List<(char fromForbidden, int r, int c, char fromProper)> deltas = [('S', 1, 0, 'N'), ('N', -1, 0, 'S'), ('E', 0, 1, 'W'), ('W', 0, -1, 'E')];
                        List<(int row, int col, char from)> paths = [];

                        foreach (var d in deltas)
                            if (previousWasFrom != d.fromForbidden && WithinBounds(thisRow + d.r, thisCol + d.c, circuit))
                            {
                                if (CheckIfCanAny(circuit[thisRow + d.r][thisCol + d.c], d.fromProper))
                                    paths.Add((thisRow + d.r, thisCol + d.c, d.fromProper));
                            }

                        // if dead end, that's it
                        if (paths.Count == 0)
                            break;

                        // if only one, then go it
                        if (paths.Count == 1)
                            (thisRow, thisCol, previousWasFrom) = paths[0];

                        // if more, create new branch for each
                        if (paths.Count > 1)
                        {
                            foreach (var path in paths)
                            {
                                // when creating new branch, make sure we don't create a branch for something already existing
                                // also see if the current wire exists in paths - 2 another branhces, because that means the new one is its true parent
                                WireBranch newBranch = new(branch, thisNode);
                                branch.end.Add(newBranch);

                                newBranches.Add((newBranch, path.row, path.col, path.from));

                                thisNode.ownBranches.Add(newBranch);
                            }

                            break;
                        }
                    }

                    else
                    {
                        // component
                        if (!componentDict.ContainsKey((thisRow, thisCol)))
                        {
                            componentDict.Add((thisRow, thisCol), new(circuit[thisRow][thisCol]));
                        }

                        var comp = componentDict[(thisRow, thisCol)];
                        if (comp.begin == null)
                            comp.begin = branch;
                        else 
                            comp.end = branch;

                        branch.end.Add(comp);
                        thisNode.ends.Add(comp);

                        potentialNewNode.Add((comp, thisRow, thisCol, previousWasFrom));
                        break;
                    }
                }

                newBranches.RemoveAt(0);
            }

            // Now that the branches are over, that leaves only components now
            // If they have no end, that means there is a new node to be had
            // If they have an end, we already been there, so we can safely disregard
            while (potentialNewNode.Count > 0)
            {
                var newNode = potentialNewNode[0];

                if (newNode.comp.end == null) // if they don't have an end yet, that means there is more to unravel
                {
                    WireNode node = new WireNode();
                    nodes.Add(node);

                    NodeCompute(circuit, node, newNode.row, newNode.col, newNode.cFrom);
                }

                potentialNewNode.RemoveAt(0);
            }
        }


        /// PILLAR 2: VERIFY CIRCUIT
        /// Wire loop has been easily verified, however we must still check source loop
        public void VerifySourceLoop()
        {
            if (INVALID_CIRCUIT) return;
            List<WireBranch> frontier = [nodes[0].ownBranches[0]];

            while (frontier.Count > 0)
            {
                foreach (Atom end in frontier[0].end)
                {
                    if (end is Component c && c.element.Letter == 'b')
                    { INVALID_CIRCUIT = true; return; }

                    if (end is WireBranch wb)
                        frontier.Add(wb);
                }

                frontier.RemoveAt(0);
            }
        }


        /// PILLAR 3: MODIFIED NODAL ANALYSIS
        public double[] ModifiedNodalAnalysis()
        {
            int n = nodes.Count - 1;
            int m = batteries.Count;

            double[,] AMatrix = new double[n + m, n + m];
            double[,] GMatrix = ComputeGMatrix(n);
            double[,] BMatrix = ComputeBMatrix(n, m);
            double[,] ZMatrix = ComputeZMatrix(n, m);

            // populate A matrix
            for (int i = 0; i < n; i ++)
            {
                for (int j = 0; j < n; j++)
                    AMatrix[i, j] = GMatrix[i, j];

                for (int j = n; j < n + m; j++)
                    AMatrix[i, j] = BMatrix[i, j - n];
            }

            for (int i = n; i < n + m; i++)
            {
                for (int j = 0; j < n; j++)
                    AMatrix[i, j] = BMatrix[j, i - n];

                for (int j = n; j < n + m; j++)
                    AMatrix[i, j] = 0;
            }

            // now do A^(-1) * Z
            var A = Matrix<double>.Build.DenseOfArray(AMatrix);
            var Z = Matrix<double>.Build.DenseOfArray(ZMatrix);

            var X = A.Inverse().Multiply(Z);

            // since ground is node 0, in front of source, multiply intensity of it by -1
            X[n, 0] *= -1;

            // make sure no voltage is < 0
            double min = double.MaxValue;
            for (int i = 0; i < n; i++)
            {
                X[i, 0] = Math.Round(X[i, 0]);
                min = X[i, 0] > min ? min : X[i, 0];
            }

            for (int i = 0; i < n; i++)
                X[i, 0] -= min;


            // min * (-1) is node 0 make sure to put it in
            nodes[0].voltage = -min;

            // write values to components
            // batteries
            for (int i = n; i < n + m; i++)
                batteries[i - n].element.Amplitude = X[i, 0];

            // nodes
            for (int i = 1; i < n + 1; i++)
            {
                nodes[i].voltage = X[i - 1, 0];
                nodes[i].SetAllVolts();
            }

            return [];
        }

        public double[,] ComputeGMatrix(int n)
        {
            double[,] matrix = new double[n, n];

            // fill in diagonal (sum of conductances per node)
            for (int i = 0; i < n; i++)
            {
                foreach (Component c in nodes[i + 1].ends.FindAll(x => x.element.Letter != 'b'))
                    matrix[i, i] += 1.0 / c.element.Resistance;
            }

            // fill in offdiagonal (for each component in the circuit)
            foreach (Component c in componentDict.Values.Where(x => x.element.Letter != 'b'))
            {
                int node1 = nodes.IndexOf(c.begin.parentNode);
                int node2 = nodes.IndexOf(c.end.parentNode);

                if (node1 == node2 || node1 == 0 || node2 == 0) continue;

                matrix[node1 - 1, node2 - 1] -= 1.0 / c.element.Resistance;
                matrix[node2 - 1, node1 - 1] -= 1.0 / c.element.Resistance;
            }

            return matrix;
        }

        public double[,] ComputeBMatrix(int n, int m)
        {
            double[,] matrix = new double[n, m];

            // for each battery, write values for proper terminal connections
            // 1 for being tied to +, -1 for being tied to -, 0 if not tied to node
            for (int i = 0; i < m; i++)
            {
                int nodeBegin = nodes.IndexOf(batteries[i].begin.parentNode);
                int nodeEnd = nodes.IndexOf(batteries[i].end.parentNode);

                if (nodeBegin != 0)
                    matrix[nodeBegin - 1, i] = batteries[i].batteryCurrentCameFromGoodSide == true ? -1 : 1;

                if (nodeEnd != 0)
                    matrix[nodeEnd - 1, i] = batteries[i].batteryCurrentCameFromGoodSide == true ? 1 : -1;
            }

            return matrix;
        }

        public double[,] ComputeZMatrix(int n, int m)
        {
            double[,] matrix = new double[n + m, 1];

            // normally from 1 to n we have current sources, but we don't have any, so 0

            // from n to n + m we have battery voltages
            for (int i = 0; i < m; i++)
                matrix[n + i, 0] = batteries[i].element.Voltage;

            return matrix;
        }


        /// PILLAR 4: KIRCHOFF'S CURRENT LAW (AND CLEANUP)

        Dictionary<(int row, int col), List<char>> goTos = [];
        List<(int row, int col)> moveCrds = [];

        public void KCL(CircuitElement[][] circuit)
        {
            // First compute goTos for the entire circuit
            for (int i = 0; i < circuit.GetLength(0); i++)
                for (int j = 0; j < circuit[0].Length; j++)
                    if (circuit[i][j].Letter != '0')
                    {
                        goTos.Add((i, j), []);

                        // for battery
                        if (circuit[i][j].Letter == 'b')
                        {
                            // from N to S
                            if (circuit[i][j].Rotation == 180 && WithinBounds(i + 1, j, circuit) && CheckIfCanAny(circuit[i + 1][j], 'N'))
                                goTos[(i, j)].Add('S');

                            // from S to N
                            if (circuit[i][j].Rotation == 0 && WithinBounds(i - 1, j, circuit) && CheckIfCanAny(circuit[i - 1][j], 'S'))
                                goTos[(i, j)].Add('N');

                            // from E to W
                            if (circuit[i][j].Rotation == 90 && WithinBounds(i, j - 1, circuit) && CheckIfCanAny(circuit[i][j - 1], 'E'))
                                goTos[(i, j)].Add('W');

                            // from W to E
                            if (circuit[i][j].Rotation == 270 && WithinBounds(i, j + 1, circuit) && CheckIfCanAny(circuit[i][j + 1], 'W'))
                                goTos[(i, j)].Add('E');
                        }

                        // for altswitch
                        else if (circuit[i][j].Letter == 'S')
                        {
                            int rotation = circuit[i][j].Rotation / 90;
                            bool turnOn = circuit[i][j].IsTurnedOn;

                            if (rotation == 0)
                            {
                                if (!turnOn && WithinBounds(i, j + 1, circuit) && CheckIfCanAny(circuit[i][j + 1], 'W'))
                                    goTos[(i, j)].Add('E');
                                else if (turnOn && WithinBounds(i, j - 1, circuit) && CheckIfCanAny(circuit[i][j - 1], 'E'))
                                    goTos[(i, j)].Add('W');

                                goTos[(i, j)].Add('S');
                            }

                            if (rotation == 2)
                            {
                                if (!turnOn && WithinBounds(i, j - 1, circuit) && CheckIfCanAny(circuit[i][j - 1], 'E'))
                                    goTos[(i, j)].Add('W');
                                else if (turnOn && WithinBounds(i, j + 1, circuit) && CheckIfCanAny(circuit[i][j + 1], 'W'))
                                    goTos[(i, j)].Add('E');

                                goTos[(i, j)].Add('N');
                            }

                            if (rotation == 1)
                            {
                                if (!turnOn && WithinBounds(i - 1, j, circuit) && CheckIfCanAny(circuit[i - 1][j], 'S'))
                                    goTos[(i, j)].Add('N');
                                else if (turnOn && WithinBounds(i + 1, j, circuit) && CheckIfCanAny(circuit[i + 1][j], 'N'))
                                    goTos[(i, j)].Add('S');

                                goTos[(i, j)].Add('E');
                            }

                            if (rotation == 3)
                            {
                                if (!turnOn && WithinBounds(i + 1, j, circuit) && CheckIfCanAny(circuit[i + 1][j], 'N'))
                                    goTos[(i, j)].Add('S');
                                else if (turnOn && WithinBounds(i - 1, j, circuit) && CheckIfCanAny(circuit[i - 1][j], 'S'))
                                    goTos[(i, j)].Add('N');

                                goTos[(i, j)].Add('W');
                            }
                        }

                        // for wire
                        else if (circuit[i][j].Letter == 'c')
                        {
                            // from N to S
                            if (WithinBounds(i + 1, j, circuit) && CheckIfCanAny(circuit[i + 1][j], 'N'))
                                goTos[(i, j)].Add('S');

                            // from S to N
                            if (WithinBounds(i - 1, j, circuit) && CheckIfCanAny(circuit[i - 1][j], 'S'))
                                goTos[(i, j)].Add('N');

                            // from E to W
                            if (WithinBounds(i, j - 1, circuit) && CheckIfCanAny(circuit[i][j - 1], 'E'))
                                goTos[(i, j)].Add('W');

                            // from W to E
                            if (WithinBounds(i, j + 1, circuit) && CheckIfCanAny(circuit[i][j + 1], 'W'))
                                goTos[(i, j)].Add('E');
                        }

                        // for t2
                        else
                        {
                            // for switch
                            if (circuit[i][j].Letter == 's' && !circuit[i][j].IsTurnedOn)
                                continue;

                            if (circuit[i][j].Rotation == 0 || circuit[i][j].Rotation == 180)
                            {
                                // from N to S
                                if (WithinBounds(i + 1, j, circuit) && CheckIfCanAny(circuit[i + 1][j], 'N'))
                                    goTos[(i, j)].Add('S');

                                // from S to N
                                if (WithinBounds(i - 1, j, circuit) && CheckIfCanAny(circuit[i - 1][j], 'S'))
                                    goTos[(i, j)].Add('N');
                            }

                            if (circuit[i][j].Rotation == 90 || circuit[i][j].Rotation == 270)
                            {
                                // from E to W
                                if (WithinBounds(i, j - 1, circuit) && CheckIfCanAny(circuit[i][j - 1], 'E'))
                                    goTos[(i, j)].Add('W');

                                // from W to E
                                if (WithinBounds(i, j + 1, circuit) && CheckIfCanAny(circuit[i][j + 1], 'W'))
                                    goTos[(i, j)].Add('E');
                            }
                        }


                        // Then compute moveCrds based on positive intensity batteries
                        if (circuit[i][j].Letter == 'b' && circuit[i][j].Amplitude > 0)
                            moveCrds.Add((i, j));
                    }

            // Then traverse while marking currentFroms and currentTos and deleting goTos from the desination (if i go S then next guy will have N removed as we came from there)
            while (moveCrds.Count > 0)
            {
                // Check if all coords have 2+ goTos
                bool all2Plus = true;
                foreach (var m in moveCrds)
                    if (goTos[m].Count < 2) all2Plus = false;

                if (all2Plus)
                {
                    //If they do, take coord[0], go all its ways and split it for all of them, proceed
                    while (goTos[moveCrds[0]].Count > 0)
                        moveCrds.Add(KCLMoveDeletion(0, goTos[moveCrds[0]][0], circuit));
                }

                for (int i = 0; i < moveCrds.Count; i++)
                {
                    // If we end up somewhere with 1 goTo, proceed until we no longer can
                    while (goTos[moveCrds[i]].Count == 1)
                    {
                        // Manage current component
                        KCLDoMove(i);

                        // Now that that's done, we can eliminate the current spot and proceed
                        moveCrds[i] = KCLMoveDeletion(i, goTos[moveCrds[i]][0], circuit);
                    }

                    // If we end up somewhere with 0 goTos, delete
                    if (goTos[moveCrds[i]].Count == 0)
                    {
                        moveCrds.RemoveAt(i);
                        i--;
                        continue;
                    }

                    // If we end up somewhere with 2+ goTos, skip. If all have 2+, the earlier check will make sure they no longer do
                    if (goTos[moveCrds[i]].Count > 1)
                        continue;
                }
            }
        }

        void KCLDoMove(int moveID)
        {
            if (componentDict.ContainsKey(moveCrds[moveID]))
            {
                Component comp = componentDict[moveCrds[moveID]];

                // When we end up on a light or resistor, calculate its intensity using ohms law and set its neighbouring branches as that
                if (comp.element.Letter == 'l' || comp.element.Letter == 'r')
                {
                    double voltage = comp.end.voltage - comp.begin.voltage;
                    if (voltage < 0) voltage *= -1;
                    double intensity = voltage / comp.element.Resistance;

                    comp.element.Amplitude = intensity;

                    comp.begin.intensity = intensity;
                    comp.begin.SetAllIntensities();

                    comp.end.intensity = intensity;
                    comp.end.SetAllIntensities();
                }

                // When we end up on a battery, set its neighbouring branches as its intensity
                if (comp.element.Letter == 'b')
                {
                    double intensity = comp.element.Amplitude;

                    comp.begin.intensity = intensity;
                    comp.begin.SetAllIntensities();

                    comp.end.intensity = intensity;
                    comp.end.SetAllIntensities();
                }

                // When we end up on an ammeter, it was treated earlier as wire, so don't do anything
                if (comp.element.Letter == 'a')
                {
                }

                // When we end up on a voltmeter, set its voltage based on the difference of begin.voltage - end.voltage
                if (comp.element.Letter == 'v')
                {
                    comp.element.Voltage = comp.begin.voltage - comp.end.voltage;
                }
            }
        }

        (int row, int col) KCLMoveDeletion(int moveID, char goWas, CircuitElement[][] circuit)
        {
            // Deletes current move from goTos
            int iDelta = 0, jDelta = 0;

            if (goWas == 'S') iDelta = 1;
            if (goWas == 'N') iDelta = -1;
            if (goWas == 'E') jDelta = 1;
            if (goWas == 'W') jDelta = -1;

            (int row, int col) newMove = (moveCrds[moveID].row + iDelta, moveCrds[moveID].col + jDelta);
            goTos[moveCrds[moveID]].Remove(goWas);

            char goTo = goWas == 'S' ? 'N' :
                       (goWas == 'N' ? 'S' :
                       (goWas == 'E' ? 'W' : 'E'));
            goTos[newMove].Remove(goTo);

            // Memorize current flow in elements
            circuit[moveCrds[moveID].row][moveCrds[moveID].col].currentTo.Add(goWas);
            circuit[newMove.row][newMove.col].currentFrom.Add(goTo);

            // Return new move
            return newMove;
        }

        public void CleanUp()
        {
            // see if this is required actually (by testing with stray branches and check their intensity)

            // e posibil ca am sa fie 0 atunci cand avem nod cu fir care are rezistenta 0 in paralel, vezi caz

            // check all branches in all nodes
            // if they have no end (that has resistance) then they're useless remove them and set their amplitude to 0
            // then repeat checking
        }
    }

    public class Atom { }

    public class WireBranch : Atom
    {
        public WireNode? parentNode;

        public Atom begin;
        public List<CircuitElement> wires;
        public List<Atom> end;

        public double voltage = 0, intensity = 0;

        public WireBranch(Atom start, WireNode wireDad)
        {
            begin = start;
            wires = [];
            end = [];
            parentNode = wireDad;
        }

        public void SetAllIntensities()
        {
            foreach (var c in wires)
                c.Amplitude = intensity;
        }

        public void SetToZero()
        {
            intensity = 0;
            SetAllIntensities();
        }
    }

    public class Component : Atom
    {
        public WireBranch? begin;
        public CircuitElement element;
        public WireBranch? end;

        // when this is true, positive is on end node, and negative is on begin node
        // otherwise, reverse
        public bool batteryCurrentCameFromGoodSide;

        public Component(CircuitElement persona)
        {
            element = persona;
        }
    }

    public class WireNode
    {
        public List<Component> ends;
        public List<WireBranch> ownBranches;
        public double voltage;

        public WireNode()
        {
            ends = [];
            ownBranches = [];
        }

        public void SetAllVolts()
        {
            foreach (var wb in ownBranches)
                wb.voltage = voltage;
        }
    }
}
