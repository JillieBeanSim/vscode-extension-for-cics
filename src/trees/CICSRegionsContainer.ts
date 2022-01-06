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

import { TreeItemCollapsibleState, TreeItem, window, ProgressLocation } from "vscode";
import { CICSPlexTree } from "./CICSPlexTree";
import { CICSRegionTree } from "./CICSRegionTree";
import { CICSTree } from "./CICSTree";
import { ProfileManagement } from "../utils/profileManagement";
import { getIconPathInResources } from "../utils/getIconPath";
import { getResource } from "@zowe/cics-for-zowe-cli";
import * as https from "https";

export class CICSRegionsContainer extends TreeItem {
  children: (CICSRegionTree)[];
  parent: CICSPlexTree;
  resourceFilters: any;
  activeFilter: string | undefined;

  constructor(
    parent: CICSPlexTree,
    public iconPath = getIconPathInResources("folder-closed-dark.svg", "folder-closed-light.svg")
  ) {
    super('Regions', TreeItemCollapsibleState.Collapsed);
    this.contextValue = `cicsregionscontainer.`;
    this.parent = parent;
    this.children = [];
  }

  public async filterRegions(pattern: string, tree: CICSTree) {
    this.children = [];
    const patternList = pattern.split(",");
    let patternString = "";
    for (const index in patternList) {
      patternString += `(^${patternList[index].replace("*","(.*)")})`;
      if (parseInt(index) !== patternList.length-1) {
        patternString += "|";
      }
    }
    this.activeFilter = pattern === "*" ? undefined : patternString;
    const regex = new RegExp(patternString);
    this.setLabel(pattern === "*" ? `Regions` : `Regions (${pattern})`);
    window.withProgress({
      title: 'Filtering regions',
      location: ProgressLocation.Notification,
      cancellable: true
    }, async (_, token) => {
      token.onCancellationRequested(() => {
        console.log("Cancelling the filter");
      });
      const regionInfo = await ProfileManagement.getRegionInfoInPlex(this.parent);
      let totalCount = 0;
      let activeCount = 0;
      for (const region of regionInfo) {
        if (region.cicsname.match(regex)){
          const newRegionTree = new CICSRegionTree(
            region.cicsname, 
            region, 
            this.parent.parent, 
            this.parent);
          this.addRegion(newRegionTree);
          totalCount += 1;
            if (region.cicsstate === 'ACTIVE') {
              activeCount += 1;
            }
        }
      }
      const newLabel = pattern === "*" ? `Regions [${activeCount}/${totalCount}]` : `Regions (${pattern}) [${activeCount}/${totalCount}]`;
      this.setLabel(newLabel);
      this.collapsibleState = TreeItemCollapsibleState.Expanded;
      this.iconPath = getIconPathInResources("folder-open-dark.svg", "folder-open-light.svg");
      tree._onDidChangeTreeData.fire(undefined);
      if (!this.children.length){
        window.showInformationMessage(`No regions found for ${this.parent.getPlexName()}`);
      }
    });
  
  }

  public async loadRegionsInCICSGroup(tree: CICSTree) {
    const parentPlex = this.getParent();
    const plexProfile = parentPlex.getProfile();
    https.globalAgent.options.rejectUnauthorized = plexProfile.profile!.rejectUnauthorized;
    const session = parentPlex.getParent().getSession();
    const regionsObtained = await getResource(session, {
        name: "CICSManagedRegion",
        cicsPlex: plexProfile.profile!.cicsPlex,
        regionName: plexProfile.profile!.regionName
    });
    https.globalAgent.options.rejectUnauthorized = undefined;
    this.clearChildren(); 
    const regionsArray = Array.isArray(regionsObtained.response.records.cicsmanagedregion) ? regionsObtained.response.records.cicsmanagedregion : [regionsObtained.response.records.cicsmanagedregion];
    let activeCount = 0;
    let totalCount = 0;
    const regionFilterRegex = parentPlex.getActiveFilter() ? RegExp(parentPlex.getActiveFilter()!) : undefined;
    for (const region of regionsArray) {
      // If region filter exists then match it
      if (!regionFilterRegex || region.cicsname.match(regionFilterRegex)) {
        const newRegionTree = new CICSRegionTree(region.cicsname, region, parentPlex.getParent(), parentPlex);
        //@ts-ignore
        this.addRegion(newRegionTree);
        totalCount += 1;
        if (region.cicsstate === 'ACTIVE') {
          activeCount += 1;
        }
      }
    }
    this.setLabel(`Regions [${activeCount}/${totalCount}]`);
    // Keep plex open after label change
    this.collapsibleState = TreeItemCollapsibleState.Expanded;
    tree._onDidChangeTreeData.fire(undefined);
  }

  public async loadRegionsInPlex() {
    const parentPlex = this.getParent();
    const regionInfo = await ProfileManagement.getRegionInfoInPlex(parentPlex);
    if (regionInfo) {   
        let activeCount = 0;
        let totalCount = 0;
        const regionFilterRegex = parentPlex.getActiveFilter() ? RegExp(parentPlex.getActiveFilter()!) : undefined;
        for (const region of regionInfo) {
            // If region filter exists then match it
            if (!regionFilterRegex || region.cicsname.match(regionFilterRegex)) {
                const newRegionTree = new CICSRegionTree(region.cicsname, region, parentPlex.getParent(), parentPlex);
                this.addRegion(newRegionTree);
                totalCount += 1;
                if (region.cicsstate === 'ACTIVE') {
                    activeCount += 1;
                }
            }
        }
        this.setLabel(`Regions [${activeCount}/${totalCount}]`);
        // Keep plex open after label change
        this.collapsibleState = TreeItemCollapsibleState.Expanded;
    }
  }

  public addRegion(region: CICSRegionTree) {
    this.children.push(region);
  }

  public getChildren() {
    return this.children;
  }

  public setLabel(label: string) {
    this.label = label;
  }

  public getParent() {
    return this.parent;
  }

  public clearChildren() {
    this.children = [];
  }
}