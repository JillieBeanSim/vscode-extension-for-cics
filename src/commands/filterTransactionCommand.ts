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

import { commands, window } from "vscode";
import { CICSTree } from "../trees/CICSTree";
import { CICSProgramTreeItem } from "../trees/treeItems/CICSProgramTreeItem";
import { CICSTransactionTreeItem } from "../trees/treeItems/CICSTransactionTreeItem";
import { PersistentFilters } from "../utils/PersistentStorage";

export function getFilterTransactionCommand(tree: CICSTree) {
  return commands.registerCommand(
    "cics-extension-for-zowe.filterTransactions",
    async (node) => {
      if (node) {
        const persistentFilters = new PersistentFilters("Zowe-CICS-Persistent");
        const chosenFilter = await window.showQuickPick(
          [{ label: "\uFF0B Create New Transaction Filter" }].concat(persistentFilters.getTransactionSearchHistory().map(loadedFilter => {
            return { label: loadedFilter };
          })),
          {
            ignoreFocusOut: true,
            placeHolder: "Select past filter or create new...",
          }
        );

        if (chosenFilter) {
          let filterText;
          if (chosenFilter.label.includes("\uFF0B")) {
            filterText = await window.showInputBox({
              title: "Enter new transaction filter",
              prompt: "New transaction filter (eg. IBM*)",
              ignoreFocusOut: true
            });
          } else {
            filterText = chosenFilter.label;
          }

          if (filterText) {
            await persistentFilters.addTransactionSearchHistory(filterText);
            node.setFilter(filterText);
            await node.loadContents();
            tree._onDidChangeTreeData.fire(undefined);
          }
        }
      }
    }
  );
}
