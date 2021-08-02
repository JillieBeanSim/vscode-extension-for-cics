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

import { TreeItemCollapsibleState, TreeItem } from "vscode";
import { CICSRegionTree } from "../CICSRegionTree";
import { join } from "path";

export class CICSTransactionDefinitionTreeItem extends TreeItem {
  transactionDefinition: any;
  parentRegion: CICSRegionTree;

  constructor(
    transactionDefinition: any,
    parentRegion: CICSRegionTree,
    public readonly iconPath = {
      light: join(__filename, "..", "..", "..", "..", "resources", "imgs", "program-dark.svg"),
      dark: join(__filename, "..", "..", "..", "..", "resources", "imgs", "program-light.svg"),
    }
  ) {

    super(
      `${transactionDefinition.name}${transactionDefinition.status.toLowerCase() === "disabled" ? " (Disabled)" : ""
      }`,
      TreeItemCollapsibleState.None
    );
    this.transactionDefinition = transactionDefinition;
    this.parentRegion = parentRegion;
    this.contextValue = `cicsdefinitiontransaction.${transactionDefinition.status.toLowerCase()}.${transactionDefinition.name
      }`;
  }
}
