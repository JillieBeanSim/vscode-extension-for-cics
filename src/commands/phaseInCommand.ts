/*
* This program and the accompanying materials are made available under the terms of the
* Eclipse Public License v2.0 which accompanies this distribution, and is available at
* https://www.eclipse.org/legal/epl-v20.html
*
* SPDX-License-Identifier: EPL-2.0
*
* Copyright Contributors to the Zowe Project.
*
*/

import { CicsCmciConstants, CicsCmciRestClient } from "@zowe/cics-for-zowe-cli";
import { AbstractSession } from "@zowe/imperative";
import { commands, ProgressLocation, TreeView, window } from "vscode";
import { CICSRegionTree } from "../trees/CICSRegionTree";
import { CICSTree } from "../trees/CICSTree";
import * as https from "https";
import { CICSRegionsContainer } from "../trees/CICSRegionsContainer";
import { CICSProgramTreeItem } from "../trees/treeItems/CICSProgramTreeItem";
import { findSelectedNodes, splitCmciErrorMessage } from "../utils/commandUtils";
import { CICSCombinedProgramTree } from "../trees/CICSCombinedTrees/CICSCombinedProgramTree";

/**
 * Performs PHASE IN on selected CICSProgram nodes.
 * @param tree - tree which contains the node
 * @param treeview - Tree View of current cics tree
 */
 export function getPhaseInCommand(tree: CICSTree, treeview: TreeView<any>) {
  return commands.registerCommand(
    "cics-extension-for-zowe.phaseInCommand",
    async (clickedNode) => {
      const allSelectedNodes = findSelectedNodes(treeview, CICSProgramTreeItem, clickedNode);
      if (!allSelectedNodes || !allSelectedNodes.length) {
        window.showErrorMessage("No CICS program selected");
        return;
      }
      let parentRegions: CICSRegionTree[] = [];
      window.withProgress({
        title: 'Phase In',
        location: ProgressLocation.Notification,
        cancellable: true
      }, async (progress, token) => {
        token.onCancellationRequested(() => {
          console.log("Cancelling the Phase In");
        });
        for (const index in allSelectedNodes) {
          progress.report({
            message: `Phase In ${parseInt(index) + 1} of ${allSelectedNodes.length}`,
            increment: (parseInt(index) / allSelectedNodes.length) * 100,
          });
          const currentNode = allSelectedNodes[parseInt(index)];
          
          https.globalAgent.options.rejectUnauthorized = currentNode.parentRegion.parentSession.session.ISession.rejectUnauthorized;
          
          try {
            await performPhaseIn(
              currentNode.parentRegion.parentSession.session,
              {
                name: currentNode.program.program,
                regionName: currentNode.parentRegion.label,
                cicsPlex: currentNode.parentRegion.parentPlex ? currentNode.parentRegion.parentPlex.getPlexName() : undefined,
              }
            );
            https.globalAgent.options.rejectUnauthorized = undefined;

            if(!parentRegions.includes(currentNode.parentRegion)){
              parentRegions.push(currentNode.parentRegion);
            }
          } catch (error) {
            https.globalAgent.options.rejectUnauthorized = undefined;
            // @ts-ignore
            if (error.mMessage) {
              // @ts-ignore
              const [_, resp2, respAlt, eibfnAlt] = splitCmciErrorMessage(error.mMessage);
              window.showErrorMessage(`Perform PHASEIN on Program "${allSelectedNodes[parseInt(index)].program.program}" failed: EXEC CICS command (${eibfnAlt}) RESP(${respAlt}) RESP2(${resp2})`);
            } else {
              window.showErrorMessage(`Something went wrong when performing a PHASEIN - ${JSON.stringify(error, Object.getOwnPropertyNames(error)).replace(/(\\n\t|\\n|\\t)/gm," ")}`);
            }
          }
        }
        // Reload contents
        for (const parentRegion of parentRegions) {
          try {
            const programTree = parentRegion.children!.filter((child: any) => child.contextValue.includes("cicstreeprogram."))[0];
            // Only load contents if the tree is expanded
            if (programTree.collapsibleState === 2) {
              await programTree.loadContents();
            }
            // if node is in a plex and the plex contains the region container tree
            if (parentRegion.parentPlex && parentRegion.parentPlex.children.some((child) => child instanceof CICSRegionsContainer)) {
              const allProgramsTree = parentRegion.parentPlex!.children!.filter((child: any) => child.contextValue.includes("cicscombinedprogramtree."))[0] as CICSCombinedProgramTree;
              if (allProgramsTree.collapsibleState === 2 && allProgramsTree.getActiveFilter()) {
                await allProgramsTree.loadContents(tree);
              }
            }
          } catch (error) {
            window.showErrorMessage(`Something went wrong when reloading programs - ${JSON.stringify(error, Object.getOwnPropertyNames(error)).replace(/(\\n\t|\\n|\\t)/gm," ")}`);
          }
        }
        tree._onDidChangeTreeData.fire(undefined);
      });
    }
  );
}

async function performPhaseIn(
  session: AbstractSession,
  parms: { cicsPlex: string | null; regionName: string; name: string; }
) {
  const requestBody: any = {
    request: {
      action: {
        $: {
          name: "PHASEIN",
        },
      },
    },
  };

  const cicsPlex = parms.cicsPlex === undefined ? "" : parms.cicsPlex + "/";
  const cmciResource =
    "/" +
    CicsCmciConstants.CICS_SYSTEM_MANAGEMENT +
    "/" +
    CicsCmciConstants.CICS_PROGRAM_RESOURCE +
    "/" +
    cicsPlex +
    parms.regionName +
    "?CRITERIA=(PROGRAM=" +
    parms.name +
    ")";

  return CicsCmciRestClient.putExpectParsedXml(
    session,
    cmciResource,
    [],
    requestBody
  ) as any;
}
