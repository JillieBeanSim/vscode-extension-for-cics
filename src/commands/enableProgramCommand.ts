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

import {
  CicsCmciConstants,
  CicsCmciRestClient,
  ICMCIApiResponse,
} from "@zowe/cics-for-zowe-cli";
import { AbstractSession } from "@zowe/imperative";
import { commands, ProgressLocation, TreeView, window } from "vscode";
import { CICSRegionTree } from "../trees/CICSRegionTree";
import { CICSTree } from "../trees/CICSTree";
import * as https from "https";

export function getEnableProgramCommand(tree: CICSTree, treeview: TreeView<any>) {
  return commands.registerCommand(
    "cics-extension-for-zowe.enableProgram",
    async (clickedNode) => {
      if (clickedNode) {
        try {
          const selectedNodes = treeview.selection.filter((selectedNode) => selectedNode !== clickedNode);
          const allSelectedNodes = [clickedNode, ...selectedNodes];
          let parentRegions: CICSRegionTree[] = [];

          window.withProgress({
            title: 'Enable',
            location: ProgressLocation.Notification,
            cancellable: true
          }, async (progress, token) => {
            token.onCancellationRequested(() => {
              console.log("Cancelling the Enable");
            });
            for (const index in allSelectedNodes) {
              progress.report({
                message: `Enabling ${parseInt(index) + 1} of ${allSelectedNodes.length}`,
                increment: (parseInt(index) / allSelectedNodes.length) * 100,
              });
              try {
                const currentNode = allSelectedNodes[parseInt(index)];
                
                https.globalAgent.options.rejectUnauthorized = currentNode.parentRegion.parentSession.session.ISession.rejectUnauthorized;

                await enableProgram(
                  currentNode.parentRegion.parentSession.session,
                  {
                    name: currentNode.program.program,
                    regionName: currentNode.parentRegion.label,
                    cicsPlex: currentNode.parentRegion.parentPlex ? currentNode.parentRegion.parentPlex.plexName : undefined,
                  }
                );
                https.globalAgent.options.rejectUnauthorized = undefined;
                if (!parentRegions.includes(currentNode.parentRegion)) {
                  parentRegions.push(currentNode.parentRegion);
                }
              } catch (err) {
                https.globalAgent.options.rejectUnauthorized = undefined;
                // @ts-ignore
                window.showErrorMessage(err);
              }
            }
            for (const parentRegion of parentRegions) {
              const programTree = parentRegion.children!.filter((child: any) => child.contextValue.includes("cicstreeprogram."))[0];
              await programTree.loadContents();
            }
            tree._onDidChangeTreeData.fire(undefined);
          });
        } catch (err) {
          // @ts-ignore
          window.showErrorMessage(err);
        }
      } else {
        window.showErrorMessage("No CICS program selected");
      }
    }
  );
}

async function enableProgram(
  session: AbstractSession,
  parms: { name: string; regionName: string; cicsPlex: string; }
): Promise<ICMCIApiResponse> {
  const requestBody: any = {
    request: {
      action: {
        $: {
          name: "ENABLE",
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

  return await CicsCmciRestClient.putExpectParsedXml(
    session,
    cmciResource,
    [],
    requestBody
  );
}
