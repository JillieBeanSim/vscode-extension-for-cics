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
import { join } from "path";
import { CICSProgramTreeItem } from "./treeItems/CICSProgramTreeItem";
import { CICSRegionTree } from "./CICSRegionTree";
import { getResource } from "@zowe/cics-for-zowe-cli";

export class CICSProgramTree extends TreeItem {
  children: CICSProgramTreeItem[] = [];
  parentRegion: CICSRegionTree;
  activeFilter: string | undefined = undefined;

  constructor(
    parentRegion: CICSRegionTree,
    public readonly iconPath = {
      light: join(
        __filename,
        "..",
        "..",
        "..",
        "resources",
        "imgs",
        "list-dark.svg"
      ),
      dark: join(
        __filename,
        "..",
        "..",
        "..",
        "resources",
        "imgs",
        "list-light.svg"
      ),
    }
  ) {
    super('Programs', TreeItemCollapsibleState.Collapsed);
    this.contextValue = `cicstreeprogram.${this.activeFilter ? 'filtered' : 'unfiltered'}.programs`;
    this.parentRegion = parentRegion;
  }

  public addProgram(program: CICSProgramTreeItem) {
    this.children.push(program);
  }

  public async loadContents() {
    try {
      const programResponse = await getResource(this.parentRegion.parentSession.session, {
        name: "CICSProgram",
        regionName: this.parentRegion.getRegionName(),
        cicsPlex: this.parentRegion.parentPlex ? this.parentRegion.parentPlex!.getPlexName() : undefined,
        criteria:
          "NOT (PROGRAM=CEE* OR PROGRAM=DFH* OR PROGRAM=CJ* OR PROGRAM=EYU* OR PROGRAM=CSQ* OR PROGRAM=CEL* OR PROGRAM=IGZ*)"
      });

      this.children = [];
      for (const program of programResponse.response.records.cicsprogram) {
        if (!this.activeFilter) {
          const newProgramItem = new CICSProgramTreeItem(program, this.parentRegion);
          //@ts-ignore
          this.addProgram(newProgramItem);
        } else {
          const regex = new RegExp(this.activeFilter.toUpperCase());
          if (regex.test(program.program)) {
            const newProgramItem = new CICSProgramTreeItem(program, this.parentRegion);
            //@ts-ignore
            this.addProgram(newProgramItem);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  public clearFilter() {
    this.activeFilter = undefined;
    this.contextValue = `cicstreeprogram.${this.activeFilter ? 'filtered' : 'unfiltered'}.programs`;
    this.label = `Programs`;
    this.collapsibleState = TreeItemCollapsibleState.Expanded;
  }

  public setFilter(newFilter: string) {
    this.activeFilter = newFilter;
    this.contextValue = `cicstreeprogram.${this.activeFilter ? 'filtered' : 'unfiltered'}.programs`;
    this.label = `Programs (${this.activeFilter})`;
    this.collapsibleState = TreeItemCollapsibleState.Expanded;
  }
}
